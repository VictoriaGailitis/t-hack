import asyncio
from tempfile import tempdir

from src.budgets.models import Budget
from src.database import get_session, engine
import pandas as pd
import joblib
import os
import lightgbm as lgb
from sqlalchemy.sql import text

async def brute_force_prediction():
    # SQL-запросы для агрегации данных и вычисления сезонного коэффициента
    query_aggregated_data = """
    SELECT
        brand_id,
        DATE_TRUNC('month', date) AS month,
        SUM(trxn_sum) AS total_trxn_sum,
        SUM(trxn_count) AS total_trxn_count
    FROM
        transactions_N
    GROUP BY
        brand_id, DATE_TRUNC('month', date);
    """

    query_seasonal_data = """
    WITH aggregated_data AS (
        SELECT
            brand_id,
            DATE_TRUNC('month', date) AS month,
            SUM(trxn_sum) AS total_trxn_sum,
            SUM(trxn_count) AS total_trxn_count
        FROM
            transactions_N
        GROUP BY
            brand_id, DATE_TRUNC('month', date)
    )
    SELECT
        month,
        AVG(total_trxn_count) / NULLIF(LAG(AVG(total_trxn_count)) OVER (ORDER BY month), 0) AS seasonal_factor
    FROM
        aggregated_data
    GROUP BY
        month;
    """

    query_expected_data = """
    WITH aggregated_data AS (
        SELECT
            brand_id,
            DATE_TRUNC('month', date) AS month,
            SUM(trxn_sum) AS total_trxn_sum,
            SUM(trxn_count) AS total_trxn_count
        FROM
            transactions_N
        GROUP BY
            brand_id, DATE_TRUNC('month', date)
    ),
    seasonal_data AS (
        SELECT
            month,
            AVG(total_trxn_count) / NULLIF(LAG(AVG(total_trxn_count)) OVER (ORDER BY month), 0) AS seasonal_factor
        FROM
            aggregated_data
        GROUP BY
            month
    )
    SELECT
        ad.brand_id,
        ad.month,
        ad.total_trxn_sum * COALESCE(sd.seasonal_factor, 1) AS expected_trxn_sum,
        ad.total_trxn_count * COALESCE(sd.seasonal_factor, 1) AS expected_trxn_count
    FROM
        aggregated_data ad
    LEFT JOIN
        seasonal_data sd ON ad.month = sd.month;
    """

    query_total_cashback = """
    SELECT
        SUM(amount_trans * cb_percent / 100) AS total_cashback
    FROM
        cb_accruals
    WHERE
        date_part('year', month) = date_part('year', CURRENT_DATE)
        AND date_part('month', month) = date_part('month', CURRENT_DATE);
    """

    with engine.connect() as connection:
        result_aggregated_data = connection.execute(text(query_aggregated_data)).fetchall()
        result_seasonal_data = connection.execute(text(query_seasonal_data)).fetchall()
        result_expected_data = connection.execute(text(query_expected_data)).fetchall()
        result_total_cashback = connection.execute(text(query_total_cashback)).fetchone()

    if result_expected_data:
        first_row = result_expected_data[0]
        gmv = first_row[2]  # expected_trxn_sum
        purchase_count = first_row[3]  # expected_trxn_count
        total_cashback = result_total_cashback[0] if result_total_cashback and result_total_cashback[0] else 0
    else:
        gmv = 0
        purchase_count = 0
        total_cashback = 0

    return gmv, purchase_count, total_cashback

async def ml_function(budget_id: id, df: pd.DataFrame):
    try:
        # model_purchase = joblib.load('src/budgets/model_purchase.pkl')
        # model_amount_purchase = joblib.load('src/budgets/model_amount_purchase.pkl')
        # model_amount_cb = joblib.load('src/budgets/model_amount_cb.pkl')
        # gmv = model_purchase.predict(df, predict_disable_shape_check=True)
        # purchaseCount = model_amount_purchase.predict(df, predict_disable_shape_check=True)
        # totalCashback = model_amount_cb.predict(df, predict_disable_shape_check=True)

        # Используем функцию брутфорс для предсказаний
        gmv, purchaseCount, totalCashback = await brute_force_prediction()

        generator = get_session()
        session = next(generator)
        db_budget = session.query(Budget).filter(Budget.id == budget_id).update({
            "gmv": abs(float(gmv)),
            "purchaseCount": abs(int(purchaseCount)),
            "totalCashback": abs(float(totalCashback)),
            "status": "Завершен"
        })
        session.commit()
        session.refresh(db_budget)
    except asyncio.CancelledError:
        generator = get_session()
        session = next(generator)
        db_budget = session.query(Budget).filter(Budget.id == budget_id).update({"status": "Отменен"})
        session.commit()
        session.refresh(db_budget)

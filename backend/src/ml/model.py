import pandas as pd
import numpy as np
import lightgbm as lgb
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import joblib

# Чтение данных и фильтрация до 150 тысяч строк
offer_stat = pd.read_csv('./data/offer_statistic.csv')
cb_accruals = pd.read_csv('./data/cb_accruals.csv').head(150000)
client_data = pd.read_csv('./data/clients.csv')

# Объединение таблиц по offer_id
merged_df = offer_stat.merge(cb_accruals, on='offer_id', how='left')

# Объединение данных по client_id
merged_df = merged_df.merge(client_data, on='client_id', how='left')

# Преобразование client_id и point_sale_name
merged_df['client_id'] = merged_df['client_id'].astype('category').cat.codes
merged_df['point_sale_name'] = merged_df['point_sale_name'].astype('category').cat.codes

# Обработка дат
merged_df['open_date'] = pd.to_datetime(merged_df['open_date'])
merged_df['close_date'] = pd.to_datetime(merged_df['close_date'])
merged_df['open_date_timestamp'] = merged_df['open_date'].astype(np.int64) // 10**9
merged_df['close_date_timestamp'] = merged_df['close_date'].astype(np.int64) // 10**9
merged_df['days_to_close'] = (merged_df['close_date'] - merged_df['open_date']).dt.days
merged_df['month'] = merged_df['open_date'].dt.month
merged_df['quarter'] = merged_df['open_date'].dt.quarter
merged_df['day_of_week'] = merged_df['open_date'].dt.dayofweek

# Конвертация категориальных признаков с высокой кардинальностью в тип category для экономии памяти
high_cardinality_columns = ['city_name', 'state_name']
for col in high_cardinality_columns:
    merged_df[col] = merged_df[col].astype('category')

# Применяем get_dummies к признакам с низкой кардинальностью и создаем sparse-матрицу для экономии памяти
merged_df = pd.get_dummies(
    merged_df,
    columns=['brand_id', 'offer_id', 'auditory_type', 'education_level', 'marital_status'],
    drop_first=True,
    sparse=True
)

# Для признаков с высокой кардинальностью используем label encoding
merged_df['city_name'] = merged_df['city_name'].cat.codes
merged_df['state_name'] = merged_df['state_name'].cat.codes

# Отделение целевых переменных и фич
X = merged_df.drop(columns=['purchase_count', 'amount_purchase', 'amount_cb', 'open_date', 'close_date'])
y_purchase = merged_df['purchase_count']
y_amount_purchase = merged_df['amount_purchase']
y_amount_cb = merged_df['amount_cb']

# Разделение данных на тренировочные и тестовые наборы
X_train, X_val, y_purchase_train, y_purchase_val = train_test_split(X, y_purchase, test_size=0.2, random_state=42)
X_train, X_val, y_amount_purchase_train, y_amount_purchase_val = train_test_split(X, y_amount_purchase, test_size=0.2, random_state=42)
X_train, X_val, y_amount_cb_train, y_amount_cb_val = train_test_split(X, y_amount_cb, test_size=0.2, random_state=42)

# Параметры модели LightGBM
params = {
    'objective': 'regression',
    'metric': 'rmse',
    'learning_rate': 0.1,
    'num_leaves': 31,
    'verbose': -1
}

# Обучение модели для предсказания purchase_count
train_data_purchase = lgb.Dataset(X_train, label=y_purchase_train)
val_data_purchase = lgb.Dataset(X_val, label=y_purchase_val, reference=train_data_purchase)
model_purchase = lgb.train(params, train_data_purchase, num_boost_round=500, valid_sets=[val_data_purchase])

# Обучение модели для предсказания amount_purchase
train_data_amount_purchase = lgb.Dataset(X_train, label=y_amount_purchase_train)
val_data_amount_purchase = lgb.Dataset(X_val, label=y_amount_purchase_val, reference=train_data_amount_purchase)
model_amount_purchase = lgb.train(params, train_data_amount_purchase, num_boost_round=500, valid_sets=[val_data_amount_purchase])

# Обучение модели для предсказания amount_cb
train_data_amount_cb = lgb.Dataset(X_train, label=y_amount_cb_train)
val_data_amount_cb = lgb.Dataset(X_val, label=y_amount_cb_val, reference=train_data_amount_cb)
model_amount_cb = lgb.train(params, train_data_amount_cb, num_boost_round=500, valid_sets=[val_data_amount_cb])

# Сохранение моделей
joblib.dump(model_purchase, 'model_purchase.pkl')
joblib.dump(model_amount_purchase, 'model_amount_purchase.pkl')
joblib.dump(model_amount_cb, 'model_amount_cb.pkl')

# Функция оценки модели
def evaluate_model(y_true, y_pred, target_name):
    rmse = np.sqrt(mean_squared_error(y_true, y_pred))
    mae = mean_absolute_error(y_true, y_pred)
    r2 = r2_score(y_true, y_pred)
    print(f"Метрики для {target_name}:")
    print(f"  RMSE: {rmse:.2f}")
    print(f"  MAE: {mae:.2f}")
    print(f"  R²: {r2:.2f}")
    print("")

# Оценка моделей
evaluate_model(y_purchase_val, model_purchase.predict(X_val), "Количество покупок")
evaluate_model(y_amount_purchase_val, model_amount_purchase.predict(X_val), "Сумма покупок")
evaluate_model(y_amount_cb_val, model_amount_cb.predict(X_val), "Сумма кешбэка")

print('Клиентские данные добавлены и модель обновлена! Проверим результат.')

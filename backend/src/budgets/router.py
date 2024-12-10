import asyncio

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from starlette import status

from .service import ml_function
from .utils import get_s3_data
from ..database import get_session
from .models import Budget
from .schemas import BudgetFullResponse, BudgetIdResponse, BudgetCreate, BudgetCalculationResponse

budget_router = APIRouter()

active_calculations: Dict[int, asyncio.Task] = {}


@budget_router.get("/", response_model=List[BudgetFullResponse])
async def get_all_budgets(db: Session = Depends(get_session)):
    budgets = db.query(Budget).all()
    return budgets


@budget_router.get("/{budget_id}", response_model=BudgetFullResponse)
async def get_budget_by_id(budget_id: int, db: Session = Depends(get_session)):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")
    return budget


@budget_router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(budget_id: int, db: Session = Depends(get_session)):
    budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if budget is None:
        raise HTTPException(status_code=404, detail="Budget not found")

    db.delete(budget)
    db.commit()

    return None


@budget_router.post("/budget-calculation", response_model=BudgetIdResponse, status_code=status.HTTP_200_OK)
async def create_budget(
        budget: BudgetCreate,
        db: Session = Depends(get_session)
):
    new_budget = Budget(
        brand_id=budget.brand_id,
        clientsFileKey=budget.clientsFileKey,
        open_date=budget.open_date,
        cb_percent=budget.cb_percent,
        status="В процессе"
    )
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    s3_data = get_s3_data(new_budget.clientsFileKey)
    task = asyncio.create_task(ml_function(new_budget.id, s3_data))
    active_calculations[new_budget.id] = task
    return BudgetIdResponse(id=new_budget.id)


@budget_router.get("/budget-calculation/{id}", response_model=BudgetCalculationResponse)
async def get_budget_calculation(id: int, db: Session = Depends(get_session)):
    budget = db.query(Budget).filter(Budget.id == id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Бюджет не найден")

    return BudgetCalculationResponse(
        gmv=budget.gmv,
        purchaseCount=budget.purchaseCount,
        totalCashback=budget.totalCashback
    )


@budget_router.post("/cancel_calculation/{budget_id}")
async def cancel_calculation(budget_id: int):
    if budget_id in active_calculations:
        task = active_calculations[budget_id]
        task.cancel()
        return {"message": f"Calculation with budget_id {budget_id} has been cancelled"}
    else:
        raise HTTPException(status_code=404, detail="Calculation not found")
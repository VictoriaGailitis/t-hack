from datetime import date

from pydantic import BaseModel, Field
from typing import Optional

class BudgetFullResponse(BaseModel):
    id: Optional[int] = Field(..., example=1, description="Уникальный идентификатор бюджета")
    brand_id: Optional[str] = Field(..., example=42, description="Идентификатор бренда")
    clientsFileKey: Optional[str] = Field(...,
                                          example="https://storage.yandexcloud.net/24hours/test_offer_clients.csv",
                                          description="Ключ файла клиентов")
    open_date: Optional[date] = Field(..., example="2024-10-26", description="Дата открытия бюджета")
    cb_percent: Optional[float] = Field(..., example=5.5, description="Процент кэшбэка")
    gmv: Optional[float] = Field(..., example=10000.0, description="Общая потраченная сумма")
    purchaseCount: Optional[int] = Field(..., example=100, description="Количество покупок")
    totalCashback: Optional[float] = Field(..., example=550.0, description="Общая сумма кэшбэка")
    status: Optional[str] = Field(..., example="В процессе", description="Статус бюджета")

    class Config:
        orm_mode = True
        schema_extra = {
            "example": {
                "id": 1,
                "brand_id": 42,
                "clientsFileKey": "https://storage.yandexcloud.net/24hours/test_offer_clients.csv",
                "open_date": "2024-10-26",
                "cb_percent": 5.5,
                "gmv": 10000.0,
                "purchaseCount": 100,
                "totalCashback": 550.0,
                "status": "Сохранен"
            }
        }

class BudgetCreate(BaseModel):
    brand_id: Optional[str]
    clientsFileKey: Optional[str]
    open_date: Optional[date]
    cb_percent: Optional[float]

class BudgetIdResponse(BaseModel):
    id: Optional[int]

class BudgetCalculationResponse(BaseModel):
    gmv: Optional[float] = Field(None, description="Общая сумма, которую потратят клиенты")
    purchaseCount: Optional[int] = Field(None, description="Количество покупок, совершенных клиентами")
    totalCashback: Optional[float] = Field(None, description="Общая сумма начисленного кэшбэка")


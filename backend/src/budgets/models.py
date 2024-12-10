from sqlalchemy import Column, Integer, BigInteger, String, Date, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()

class Budget(Base):
    __tablename__ = 'budgets'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    brand_id = Column(String)
    clientsFileKey = Column(String)
    open_date = Column(Date)
    cb_percent = Column(Float)
    gmv = Column(Float)
    purchaseCount = Column(Integer)
    totalCashback = Column(Float)
    status = Column(String(255))

    def __repr__(self):
        return f"<Budget(id={self.id}, brand_id={self.brand_id}, status='{self.status}')>"

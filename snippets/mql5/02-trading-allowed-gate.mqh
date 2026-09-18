//+------------------------------------------------------------------+
//| SHOWCASE SNIPPET — trading-allowed gate                          |
//| Illustrative only. Derived from the shared Utility layer.        |
//+------------------------------------------------------------------+

// isEaPaused is synced across charts via a terminal GlobalVariable so
// one instance's remote PAUSE_EA affects peer charts on the same account.

bool isTerminalAlgoTradingOn()
  {
   return (bool)TerminalInfoInteger(TERMINAL_TRADE_ALLOWED)
          && (bool)MQLInfoInteger(MQL_TRADE_ALLOWED);
  }

//+------------------------------------------------------------------+
//| Gate every order / manage path before touching the broker.       |
//+------------------------------------------------------------------+
bool checkTradingAllowed()
  {
   return (!isEaPaused
           && (bool)TerminalInfoInteger(TERMINAL_CONNECTED)
           && isTerminalAlgoTradingOn()
           && (bool)AccountInfoInteger(ACCOUNT_TRADE_EXPERT));
  }

//+------------------------------------------------------------------+
//| Symbol session check (broker calendar), independent of strategy. |
//+------------------------------------------------------------------+
bool isMarketOpen(string symbol, datetime time)
  {
   datetime from, to;
   MqlDateTime dt;
   TimeToStruct(time, dt);

   if(!SymbolInfoSessionTrade(symbol, (ENUM_DAY_OF_WEEK)dt.day_of_week, 0, from, to))
      return false;

   const int secondsInDay = dt.hour * 3600 + dt.min * 60 + dt.sec;

   for(int i = 0; i < 5; i++)
     {
      if(SymbolInfoSessionTrade(symbol, (ENUM_DAY_OF_WEEK)dt.day_of_week, i, from, to))
        {
         if(secondsInDay >= (int)from && secondsInDay <= (int)to)
            return true;
        }
     }
   return false;
  }

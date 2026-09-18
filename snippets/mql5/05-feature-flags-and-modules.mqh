//+------------------------------------------------------------------+
//| SHOWCASE SNIPPET — compile-time feature modules                  |
//| Illustrative only. Shows how Master_Files opt into capabilities. |
//+------------------------------------------------------------------+

// Each module header defines a flag when included. The EA entry and
// shared services then compile only the paths that are present.

// From Master_Files/Notifications/CloudUplink.mqh
#define CloudUplink_Included true

// From Master_Files/Grid/GridLayout.mqh
#define Grid_Included true

// From Master_Files/Sessions/Session_Models.mqh
#define Session_Included true

// From Master_Files/Structure/Structure_Models.mqh
#define Structure_Included true

// From Master_Files/RSI/RSI_Models.mqh
#define RSI_Included true

// From Master_Files/Notifications/License.mqh
#define License_Included true

// From Master_Files/Aux_TradeDayRules.mqh
#define TradeDayRules_Included true

//+------------------------------------------------------------------+
//| Example usage inside shared services                             |
//+------------------------------------------------------------------+
void exampleInitHooks()
  {
#ifdef Grid_Included
   // seedActiveGridConfig();
#endif

#ifdef Session_Included
   // setSessionTimes();
#endif

#ifdef Structure_Included
   // setInitialStructureLevels(...);
#endif

#ifdef CloudUplink_Included
   // configureCloudBaseUrl();
   // sendInitialAccountInfo();
#endif

#ifdef TradeDayRules_Included
   // checkMinTradingDayRules();   // compliance module hook
#endif
  }

//+------------------------------------------------------------------+
//| Architectural rule (from production README culture):             |
//|   Strategy alpha never lives inside Master_Files.                |
//|   Strategy folders own setup/monitor only.                       |
//+------------------------------------------------------------------+

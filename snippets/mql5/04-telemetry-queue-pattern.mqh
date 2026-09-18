//+------------------------------------------------------------------+
//| SHOWCASE SNIPPET — non-blocking telemetry queue                  |
//| Illustrative only. Shows enqueue shape, not production payloads. |
//+------------------------------------------------------------------+

enum ENUM_CLOUD_TASK_TYPE
  {
   CLOUD_TASK_TRADE = 0,
   CLOUD_TASK_SCREENSHOT,
   CLOUD_TASK_COMMAND_ACK
  };

struct CloudQueueItem
  {
   string               url;
   string               payload;           // serialized JSON
   ulong                ticketNumber;
   ENUM_CLOUD_TASK_TYPE taskType;
   string               screenshotFilename;
   int                  retryCount;
   datetime             nextAttemptAt;
   datetime             firstEnqueuedAt;
   int                  lastErrorCode;
  };

CloudQueueItem CloudQueue[];

//+------------------------------------------------------------------+
//| Enqueue a task; OnTimer drains the queue via WebRequest.         |
//+------------------------------------------------------------------+
void QueueCloudTask(string endpoint,
                    string serializedJson,
                    ulong ticketNumber = 0,
                    ENUM_CLOUD_TASK_TYPE taskType = CLOUD_TASK_TRADE)
  {
   const int size = ArraySize(CloudQueue);
   ArrayResize(CloudQueue, size + 1);

   CloudQueue[size].url                = "https://api.example.com/api/v2" + endpoint;
   CloudQueue[size].payload            = serializedJson;
   CloudQueue[size].ticketNumber       = ticketNumber;
   CloudQueue[size].taskType           = taskType;
   CloudQueue[size].screenshotFilename = "";
   CloudQueue[size].retryCount         = 0;
   CloudQueue[size].nextAttemptAt      = TimeCurrent();
   CloudQueue[size].firstEnqueuedAt    = TimeCurrent();
   CloudQueue[size].lastErrorCode      = 0;
  }

//+------------------------------------------------------------------+
//| Example: trade lifecycle event (field set is illustrative).      |
//| Production payloads omit proprietary condition / signal fields.  |
//+------------------------------------------------------------------+
void enqueuePositionOpened(ulong ticket, string symbol)
  {
   // Build a minimal ops payload — NOT the strategy decision record.
   string json = StringFormat(
                    "{\"ticket\":%I64u,\"symbol\":\"%s\",\"event\":\"POSITION_OPEN\"}",
                    ticket, symbol);

   QueueCloudTask("/trade/positionOpen", json, ticket, CLOUD_TASK_TRADE);
  }

//+------------------------------------------------------------------+
//| Example: screenshot upload after Base64 encode (details omitted).|
//+------------------------------------------------------------------+
void enqueueScreenshot(string filename, ulong ticket, string reason)
  {
   // Read file → CryptEncode(CRYPT_BASE64, ...) → queue CLOUD_TASK_SCREENSHOT
   string json = StringFormat(
                    "{\"ticket\":%I64u,\"reason\":\"%s\",\"filename\":\"%s\",\"encodedData\":\"...\"}",
                    ticket, reason, filename);

   QueueCloudTask("/screenshot/upload", json, 0, CLOUD_TASK_SCREENSHOT);
  }

//+------------------------------------------------------------------+
//| Called from OnTimer — send due items, retry with backoff.        |
//+------------------------------------------------------------------+
void processCloudQueue()
  {
   // for each CloudQueue[i] where nextAttemptAt <= TimeCurrent():
   //   WebRequest POST
   //   on success → remove from queue (and archive screenshot file)
   //   on failure → retryCount++, schedule nextAttemptAt
  }

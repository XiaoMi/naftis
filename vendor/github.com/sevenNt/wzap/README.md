# wzap

A wrapper of [zap](https://github.com/uber-go/zap) supporting file rotating and more humanfriendly console output.

## Quick Start

## file writer.
```golang
package main

import "github.com/sevenNt/wzap"

var logger = wzap.New(
	wzap.WithPath("/tmp/async.log"), // set log path.
	wzap.WithLevel(wzap.Error),      // set log minimum level.
)

func main() {
	logger.Info("some information about LiLei",
		"name", "LiLei",
		"age", 17,
		"sex", "male",
	)
}
```

## Fan-out

```golang
    package main

    import "github.com/sevenNt/wzap"

    var logger = wzap.New(
        // add a file writer.
        wzap.WithPath("/tmp/sync.log"),
        wzap.WithLevel(wzap.Error),
        wzap.WithOutput(
            wzap.WithOutput(
                // add another file writer.
                wzap.WithLevel(wzap.Info),
                wzap.WithPath("/tmp/info.log"),
            ),
            // add a console writer.
            wzap.WithOutput(
                wzap.WithLevelMask(wzap.DebugLevel|wzap.InfoLevel|wzap.WarnLevel),
                wzap.WithColorful(true),
                wzap.WithPrefix("H"),
                wzap.WithAsync(false),
            ),
            // add an another file writer.
            wzap.WithOutput(
                wzap.WithLevelMask(wzap.FatalLevel|wzap.ErrorLevel),
                wzap.WithPath("/tmp/error.log")
            ),
        )
    )

    func main() {
	    logger.Errorf("sync write %s", "How are you? I'm fine, thank you.")
	    logger.Debug("debug")
	    logger.Info("info")
	    logger.Warn("warn")
	    logger.Error("error")
	}
```

## setting default fields.
- setting global default fields.
```
	wzap.SetDefaultFields(
		wzap.String("aid", "12341234"),
		wzap.String("iid", "187281f-f983891-ff01923"),
		wzap.String("tid", "dasfasd-123asf-314dasfa"),
	)
```

- setting default fields for single logger instance.
```
	logger := wzap.New(
		wzap.WithLevel(wzap.Info),
		wzap.WithPath("./defaultLogger.log"),
		wzap.WithFields(wzap.Int("appid", 100010), wzap.String("appname", "test-go")),
	)
	wzap.SetDefaultLogger(logger)
	wzap.Debug("debug")
```

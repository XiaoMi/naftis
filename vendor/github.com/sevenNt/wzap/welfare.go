package wzap

// WDebug logs debug level messages with default logger.
func WDebug(log string, msg string, args ...interface{}) {
	Log(log).Debug(msg, args...)
}

// WDebugf logs debug level messages with default logger.
func WDebugf(log string, format string, args ...interface{}) {
	Log(log).Debugf(format, args...)
}

// WInfo logs Info level messages with default logger in structured-style.
func WInfo(log string, msg string, args ...interface{}) {
	Log(log).Info(msg, args...)
}

// WInfof logs Info level messages with default logger in structured-style.
func WInfof(log string, format string, args ...interface{}) {
	Log(log).Infof(format, args...)
}

// WWarn logs Warn level messages with default logger in structured-style.
func WWarn(log string, msg string, args ...interface{}) {
	Log(log).Warn(msg, args...)
}

// WWarnf logs Warn level messages with default logger in printf-style.
func WWarnf(log string, format string, args ...interface{}) {
	Log(log).Warnf(format, args...)
}

// WError logs Error level messages with default logger in structured-style.
// Notice: additional stack will be added into messages.
func WError(log, msg string, args ...interface{}) {
	Log(log).Error(msg, args...)
}

// WErrorf logs Error level messages with default logger in printf-style.
// Notice: additional stack will be added into messages.
func WErrorf(log, format string, args ...interface{}) {
	Log(log).Errorf(format, args...)
}

// WPanic logs Panic level messages with default logger in structured-style.
// Notice: additional stack will be added into messages, meanwhile logger will panic.
func WPanic(log, msg string, args ...interface{}) {
	Log(log).Panic(msg, args...)
}

// WPanicf logs Panicf level messages with default logger in printf-style.
// Notice: additional stack will be added into messages, meanwhile logger will panic.
func WPanicf(log, format string, args ...interface{}) {
	Log(log).Panicf(format, args...)
}

// WFatal logs Fatal level messages with default logger in structured-style.
// Notice: additional stack will be added into messages, then calls os.Exit(1).
func WFatal(log, msg string, args ...interface{}) {
	Log(log).Fatal(msg, args...)
}

// WFatalf logs Fatalf level messages with default logger in printf-style.
// Notice: additional stack will be added into messages, then calls os.Exit(1).
func WFatalf(log, format string, args ...interface{}) {
	Log(log).Fatalf(format, args...)
}

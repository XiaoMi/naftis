package wzap

import (
	"fmt"
	"sync"
)

var (
	loggers = make(map[string]*Logger)
	logger  = New(
		WithLevelMask(DebugLevel|InfoLevel|WarnLevel|ErrorLevel|FatalLevel),
		WithColorful(true),
		WithAsync(false),
		WithPrefix("APP]>"),
	)
	defaultFileSuffix = "log"
	mu                sync.RWMutex
)

func init() {
	loggers = map[string]*Logger{
		"default": logger,
	}
}

// Writer defines logger's writer.
type Writer interface {
	Sync() error
	Level() int
	Print(int, string, ...interface{})
	Printf(int, string, ...interface{})
	CheckErr(error, func(string, ...interface{})) bool
}

// New constructs a new Logger instance.
func New(opts ...Option) *Logger {
	var options Options
	for _, option := range opts {
		option(&options)
	}
	logger := &Logger{
		options: &options,
		writers: make([]Writer, 0),
	}
	logger.init()
	return logger
}

// Default returns a default Logger instance
func Default(name string) *Logger {
	return New(
		WithPath(name),
		WithLevelCombo("Info|Warn|Error|Panic|Fatal"),
	)
}

// SetDefaultLogger sets default logger with provided logger.
// Deprecated: use welfare API instead.
func SetDefaultLogger(l *Logger) {
	mu.Lock()
	logger = l
	loggers["default"] = l
	mu.Unlock()
}

// SetDefaultFileSuffix sets default file suffix.
func SetDefaultFileSuffix(suffix string) {
	defaultFileSuffix = suffix
}

// Log returns logger with provided name.
func Log(name string) *Logger {
	mu.RLock()
	defer mu.RUnlock()

	if _, ok := loggers[name]; !ok {
		return loggers["default"]
	}

	return loggers[name]
}

// Register registers logger into loggers.
func Register(name string, logger *Logger) {
	mu.Lock()
	defer mu.Unlock()

	loggers[name] = logger
}

func (l *Logger) init() {
	if len(l.options.writers) == 0 {
		l.options.fs = append(defaultFields, l.options.fs...)
		l.addWriter(*l.options)
	} else {
		for _, wopt := range l.options.writers {
			wopt.fs = append(defaultFields, wopt.fs...)
			l.addWriter(wopt)
		}
	}
}

func (l *Logger) addWriter(o Options) {
	if o.path != "" {
		l.writers = append(l.writers, NewZapWriter(o.path, o.level, o.fs))
	} else if o.name != "" {
		l.writers = append(l.writers, NewZapWriter(fmt.Sprintf("%s.%s", o.name, defaultFileSuffix), o.level, o.fs))
	} else {
		writer := NewConsoleWriter(o.level, o.color, o.fs)
		writer.SetAsync(o.async)
		writer.SetPrefix(o.prefix)
		l.writers = append(l.writers, writer)
	}
}

// Logger is an interface supports printf-style and structured-style logging.
type Logger struct {
	options *Options
	writers []Writer
}

// Sync syncs logger messages.
func Sync() {
	logger.Sync()
}

// Sync syncs logger messages.
func (l Logger) Sync() {
	for _, w := range l.writers {
		if err := w.Sync(); err != nil {
			fmt.Printf("logger sync fail, %#v, %s\n", w, err.Error())
		}
	}
}

// Debug logs debug level messages with default logger.
func Debug(msg string, args ...interface{}) {
	logger.Print(DebugLevel, msg, args...)
}

// Debug logs debug level messages.
func (l *Logger) Debug(msg string, args ...interface{}) {
	l.Print(DebugLevel, msg, args...)
}

// Debugf logs debug level messages with default logger in printf-style.
func Debugf(format string, args ...interface{}) {
	logger.Printf(DebugLevel, format, args...)
}

// Debugf logs debug level messages in printf-style.
func (l Logger) Debugf(format string, args ...interface{}) {
	l.Printf(DebugLevel, format, args...)
}

// Info logs Info level messages with default logger in structured-style.
func Info(msg string, args ...interface{}) {
	logger.Print(InfoLevel, msg, args...)
}

// Info logs Info level messages in structured-style.
func (l *Logger) Info(msg string, args ...interface{}) {
	l.Print(InfoLevel, msg, args...)
}

// Infof logs Info level messages with default logger in printf-style.
func Infof(format string, args ...interface{}) {
	logger.Printf(InfoLevel, format, args...)
}

// Infof logs Info level messages in printf-style.
func (l Logger) Infof(format string, args ...interface{}) {
	l.Printf(InfoLevel, format, args...)
}

// Warn logs Warn level messages with default logger in structured-style.
func Warn(msg string, args ...interface{}) {
	logger.Print(WarnLevel, msg, args...)
}

// Warn logs Warn level messages in structured-style.
func (l Logger) Warn(msg string, args ...interface{}) {
	l.Print(WarnLevel, msg, args...)
}

// Warnf logs Warn level messages with default logger in printf-style.
func Warnf(format string, args ...interface{}) {
	logger.Printf(WarnLevel, format, args...)
}

// Warnf logs Warn level messages in printf-style.
func (l Logger) Warnf(format string, args ...interface{}) {
	l.Printf(WarnLevel, format, args...)
}

// Error logs Error level messages with default logger in structured-style.
// Notice: additional stack will be added into messages.
func Error(msg string, args ...interface{}) {
	logger.Print(ErrorLevel, msg, args...)
}

// Error logs Error level messages in structured-style.
// Notice: additional stack will be added into messages.
func (l Logger) Error(msg string, args ...interface{}) {
	l.Print(ErrorLevel, msg, args...)
}

// Errorf logs Error level messages with default logger in printf-style.
// Notice: additional stack will be added into messages.
func Errorf(format string, args ...interface{}) {
	logger.Printf(ErrorLevel, format, args...)
}

// Errorf logs Error level messages in printf-style.
// Notice: additional stack will be added into messages.
func (l Logger) Errorf(format string, args ...interface{}) {
	l.Printf(ErrorLevel, format, args...)
}

// Panic logs Panic level messages with default logger in structured-style.
// Notice: additional stack will be added into messages, meanwhile logger will panic.
func Panic(msg string, args ...interface{}) {
	logger.Print(PanicLevel, msg, args...)
}

// Panic logs Panic level messages in structured-style.
// Notice: additional stack will be added into messages, meanwhile logger will panic.
func (l Logger) Panic(msg string, args ...interface{}) {
	l.Print(PanicLevel, msg, args...)
}

// Panicf logs Panicf level messages with default logger in printf-style.
// Notice: additional stack will be added into messages, meanwhile logger will panic.
func Panicf(format string, args ...interface{}) {
	logger.Printf(PanicLevel, format, args...)
}

// Panicf logs Panicf level messages in printf-style.
// Notice: additional stack will be added into messages, meanwhile logger will panic.
func (l Logger) Panicf(format string, args ...interface{}) {
	l.Printf(PanicLevel, format, args...)
}

// Fatal logs Fatal level messages with default logger in structured-style.
// Notice: additional stack will be added into messages, then calls os.Exit(1).
func Fatal(msg string, args ...interface{}) {
	logger.Print(FatalLevel, msg, args...)
}

// Fatal logs Fatal level messages in structured-style.
// Notice: additional stack will be added into messages, then calls os.Exit(1).
func (l Logger) Fatal(msg string, args ...interface{}) {
	l.Print(FatalLevel, msg, args...)
}

// Fatalf logs Fatalf level messages with default logger in printf-style.
// Notice: additional stack will be added into messages, then calls os.Exit(1).
func Fatalf(format string, args ...interface{}) {
	logger.Printf(FatalLevel, format, args...)
}

// Fatalf logs Fatalf level messages in printf-style.
// Notice: additional stack will be added into messages, then calls os.Exit(1).
func (l Logger) Fatalf(format string, args ...interface{}) {
	l.Printf(FatalLevel, format, args...)
}

// Print logs messages with provided level in structured-style.
func (l *Logger) Print(level int, msg string, args ...interface{}) {
	for _, w := range l.writers {
		if level&w.Level() == 0 {
			continue
		}
		w.Print(level, msg, args...)
	}
}

// Printf logs messages with provided level in printf-style.
func (l *Logger) Printf(level int, format string, args ...interface{}) {
	for _, w := range l.writers {
		if level&w.Level() == 0 {
			continue
		}
		w.Printf(level, format, args...)
	}
}

// CheckErr checks error with default logger.
func CheckErr(err error, logFunc func(string, ...interface{})) (isErr bool) {
	return logger.CheckErr(err, logFunc)
}

// CheckErr checks error, error will be logged if it's not equal to nil.
func (l *Logger) CheckErr(err error, logFunc func(string, ...interface{})) (isErr bool) {
	for _, w := range l.writers {
		if e := w.CheckErr(err, logFunc); e == true {
			isErr = true
		}
	}
	return
}

func checkErr(err error, logFunc func(string, ...interface{})) (isErr bool) {
	if err != nil {
		logFunc("error occurred", "error", err.Error())
	}
	return
}

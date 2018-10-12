package wzap

import (
	"fmt"

	"github.com/natefinch/lumberjack"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
)

var defaultDir string
var setDefaultDir bool

// SetDefaultDir sets default directory of all zap writer logger.
func SetDefaultDir(dir string) {
	defaultDir = dir
	setDefaultDir = true
}

// DefaultDir gets defaultDir.
func DefaultDir() string {
	return defaultDir
}

// NewZapWriter constructs a new ZapWriter instance.
func NewZapWriter(path string, level int, fs []Field) *ZapWriter {
	l := &ZapWriter{
		level: level,
	}

	encoderConfig := zap.NewProductionConfig().EncoderConfig
	encoderConfig.LevelKey = "lv"
	encoderConfig.StacktraceKey = "stack"
	enc := zapcore.NewJSONEncoder(encoderConfig)

	filePath := path
	if setDefaultDir {
		filePath = fmt.Sprintf("%s/%s", defaultDir, path)
	}
	syncer := zapcore.AddSync(&lumberjack.Logger{
		Filename:   filePath,
		MaxSize:    500, // MB
		MaxAge:     1,   // days
		MaxBackups: 100,
		LocalTime:  true,
		Compress:   true,
	})

	core := zapcore.NewCore(
		enc,
		syncer,
		zap.DebugLevel,
	)
	opts := []zap.Option{
		zap.AddStacktrace(zap.ErrorLevel),
		zap.Fields(fs...),
	}
	l.logger = zap.New(core, opts...).Sugar()

	return l
}

// A ZapWriter wraps the zap.SugarWriter.
type ZapWriter struct {
	logger  *zap.SugaredLogger
	options Options
	level   int
}

// Sync flushes any buffered log entries.
func (l *ZapWriter) Sync() error {
	return l.logger.Sync()
}

// Level return ZapWriter lever.
func (l *ZapWriter) Level() int {
	return l.level
}

// Print logs message with structured-style.
func (l *ZapWriter) Print(level int, msg string, keysAndValues ...interface{}) {
	switch level {
	case FatalLevel:
		l.logger.Fatalw(msg, keysAndValues...)
	case PanicLevel:
		l.logger.Panicw(msg, keysAndValues...)
	case ErrorLevel:
		l.logger.Errorw(msg, keysAndValues...)
	case WarnLevel:
		l.logger.Warnw(msg, keysAndValues...)
	case InfoLevel:
		l.logger.Infow(msg, keysAndValues...)
	case DebugLevel:
		l.logger.Debugw(msg, keysAndValues...)
	}
}

// Printf logs message with printf-style.
func (l *ZapWriter) Printf(level int, format string, keysAndValues ...interface{}) {
	switch level {
	case FatalLevel:
		l.logger.Fatalf(format, keysAndValues...)
	case PanicLevel:
		l.logger.Panicf(format, keysAndValues...)
	case ErrorLevel:
		l.logger.Errorf(format, keysAndValues...)
	case WarnLevel:
		l.logger.Warnf(format, keysAndValues...)
	case InfoLevel:
		l.logger.Infof(format, keysAndValues...)
	case DebugLevel:
		l.logger.Debugf(format, keysAndValues...)
	}
}

// CheckErr checks error, error will be logged if it's not equal to nil.
func (l *ZapWriter) CheckErr(err error, logFunc func(string, ...interface{})) (isErr bool) {
	return checkErr(err, logFunc)
}

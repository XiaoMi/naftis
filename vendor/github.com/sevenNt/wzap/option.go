package wzap

import (
	"fmt"
	"reflect"
	"runtime"
	"strings"

	"github.com/spf13/cast"
	"go.uber.org/zap/zapcore"
)

// Option is used to set options for the logger.
type Option func(*Options)

// Options wraps logger options.
type Options struct {
	// common options.
	name  string
	level int
	fs    []zapcore.Field

	// zapwriter options.
	path string

	// consolewriter options.
	color  bool
	prefix string
	async  bool

	// added writers.
	writers []Options
}

// WithName adds name to the Logger.
func WithName(name string) Option {
	return func(o *Options) {
		o.name = name
	}
}

// WithFields adds fields to the Logger.
func WithFields(fs ...zapcore.Field) Option {
	return func(o *Options) {
		o.fs = fs
	}
}

// WithPath configures logger path.
func WithPath(path string) Option {
	return func(o *Options) {
		o.path = path
	}
}

// WithLevel configures logger minimum level.
func WithLevel(lvFn func(string, ...interface{})) Option {
	name := runtime.FuncForPC(reflect.ValueOf(lvFn).Pointer()).Name()
	return func(o *Options) {
		o.level = minLevel(name)
	}
}

func minLevel(minLevel string) (level int) {
	lower := strings.ToLower(minLevel)
	switch {
	case strings.HasSuffix(lower, "debug"):
		level = DebugLevel | InfoLevel | WarnLevel | ErrorLevel | PanicLevel | FatalLevel
	case strings.HasSuffix(lower, "info"):
		level = InfoLevel | WarnLevel | ErrorLevel | PanicLevel | FatalLevel
	case strings.HasSuffix(lower, "warn"):
		level = WarnLevel | ErrorLevel | PanicLevel | FatalLevel
	case strings.HasSuffix(lower, "error"):
		level = ErrorLevel | PanicLevel | FatalLevel
	case strings.HasSuffix(lower, "panic"):
		level = PanicLevel | FatalLevel
	case strings.HasSuffix(lower, "fatal"):
		level = FatalLevel
	}
	return
}

func buildOptions(kv map[string]interface{}) (option Options) {
	for k, v := range kv {
		switch strings.ToLower(k) {
		case "name":
			option.name = cast.ToString(v)
		case "levelcombo":
			option.level = parseLevel(cast.ToString(v), "|")
		case "level":
			option.level = minLevel(cast.ToString(v))
		case "path", "file":
			option.path = cast.ToString(v)
		case "color":
			option.color = cast.ToBool(v)
		case "prefix":
			option.prefix = cast.ToString(v)
		case "async":
			option.async = cast.ToBool(v)
		}
	}
	return
}

// WithLevelMask configures logger enabled levels with level masks.
func WithLevelMask(lvMask int) Option {
	return func(o *Options) {
		o.level = lvMask
	}
}

// WithLevelString configures the Logger enabled levels with combined level string.
// ex. "Warn | Error | Panic | Fatal" will enable Warn, Error, Panic and Fatal level logging.
// Deprecated: use WithLevelCombo instead.
func WithLevelString(combinedLv string) Option {
	return func(o *Options) {
		o.level = parseLevel(combinedLv, "|")
	}
}

// WithLevelCombo configures the Logger enabled levels with level combos.
// ex. "Warn | Error | Panic | Fatal" will enable Warn, Error, Panic and Fatal level logging.
func WithLevelCombo(combo string) Option {
	return func(o *Options) {
		o.level = parseLevel(combo, "|")
	}
}

// WithOutput adds log a new writer with options.
func WithOutput(opts ...Option) Option {
	var options Options
	for _, opt := range opts {
		opt(&options)
	}
	return func(o *Options) {
		o.writers = append(o.writers, options)
	}
}

// WithOutputKV adds logger a new writer with KV.
func WithOutputKV(kv map[string]interface{}) Option {
	var option = buildOptions(kv)
	return func(o *Options) {
		o.writers = append(o.writers, option)
	}
}

// WithOutputKVs adds logger a new writer with KVs.
func WithOutputKVs(kvs []interface{}) Option {
	var options = make([]Options, 0)
	for _, kv := range kvs {
		kv, ok := kv.(map[string]interface{})
		if !ok {
			fmt.Printf("[WithOutputKVs] invalid kv %#v", kv)
			continue
		}
		options = append(options, buildOptions(kv))
	}

	return func(o *Options) {
		o.writers = append(o.writers, options...)
	}
}

// WithColorful configures the console-log's colorful trigger.
func WithColorful(colorful bool) Option {
	return func(o *Options) {
		o.color = colorful
	}
}

// WithPrefix configures the console-log's prefix.
func WithPrefix(prefix string) Option {
	return func(o *Options) {
		o.prefix = prefix
	}
}

// WithAsync configures the console-log's async trigger.
func WithAsync(async bool) Option {
	return func(o *Options) {
		o.async = async
	}
}

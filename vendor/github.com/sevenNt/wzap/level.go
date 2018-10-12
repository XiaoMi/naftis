package wzap

import (
	"strings"
)

// A Level is a logging priority. Higher levels are more important.
const (
	// DebugLevel logs are typically voluminous, and are usually disabled in
	// production.
	DebugLevel = 1 << iota
	// InfoLevel is the default logging priority.
	InfoLevel
	// WarnLevel logs are more important than Info, but don't need individual
	// human review.
	WarnLevel
	// ErrorLevel logs are high-priority. If an application is running smoothly,
	// it shouldn't generate any error-Level logs.
	ErrorLevel
	// PanicLevel logs a message, then panics.
	PanicLevel
	// FatalLevel logs a message, then calls os.Exit(1).
	FatalLevel
)

func parseLevel(desc string, delim string) (level int) {
	lvs := strings.Split(strings.TrimSpace(desc), delim)
	if len(lvs) == 0 {
		level |= InfoLevel | WarnLevel | ErrorLevel | PanicLevel | FatalLevel
	} else {
		for _, lv := range lvs {
			level |= levelMap(lv)
		}
	}

	return
}

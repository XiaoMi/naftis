package wzap

import (
	"bytes"
	"fmt"
	"os"
	"strings"
	"time"
)

const (
	ConsoleQueueLength = 1024 * 1024 * 10
	timestampFormat    = "2006-01-02 15:04:05"
)
const (
	nocolor = 0
	red     = 31
	green   = 32
	yellow  = 33
	blue    = 34
	magenta = 35
	gray    = 37
)

// ConsoleWriter will print logger mesgaes into console
type ConsoleWriter struct {
	level   int
	pattern string
	async   bool
	prefix  string
	color   bool
	fs      []Field

	queue chan []byte
	close chan struct{}
}

// NewConsoleWriter constructs a new ConsoleWriter instance.
func NewConsoleWriter(lv int, colorful bool, fs []Field) *ConsoleWriter {
	writer := &ConsoleWriter{
		queue: make(chan []byte, ConsoleQueueLength),
		level: lv,
		color: colorful,
		fs:    fs,
	}

	go writer.run()
	return writer
}

// SetPattern sets pattern.
func (writer *ConsoleWriter) SetPattern(pattern string) {
	writer.pattern = pattern
}

// SetPrefix sets prefix.
func (writer *ConsoleWriter) SetPrefix(prefix string) {
	writer.prefix = prefix
}

// SetAsync sets async trigger.
func (writer *ConsoleWriter) SetAsync(async bool) {
	writer.async = async
}

// Start start ConsoleWriter.
func (writer *ConsoleWriter) Start() {
	go writer.run()
}

// Sync flushes any buffered log entries.
func (writer *ConsoleWriter) Sync() error {
	if !writer.async {
		return nil
	}
	return nil
}

// Level return ConsoleWriter's level.
func (writer *ConsoleWriter) Level() int {
	if writer.level == 0 {
		return DebugLevel | InfoLevel | WarnLevel | ErrorLevel | PanicLevel | FatalLevel
	}
	return writer.level
}

// Print implements Writer Print method.
func (writer *ConsoleWriter) Print(level int, msg string, keysAndValues ...interface{}) {
	bs := writer.print(level, msg, keysAndValues...)
	if writer.async {
		writer.queue <- bs
	} else {
		writer.write(bs)
	}
}

// Printf implements Writer Printf method.
func (writer *ConsoleWriter) Printf(level int, format string, keysAndValues ...interface{}) {
	bs := writer.printf(level, format, keysAndValues...)
	if writer.async {
		writer.queue <- bs
	} else {
		writer.write(bs)
	}
}

func (writer *ConsoleWriter) run() {
	for item := range writer.queue {
		writer.write(item)
	}
}

func (writer *ConsoleWriter) write(bs []byte) {
	fmt.Fprint(os.Stdout, string(bs))
}

func (writer *ConsoleWriter) print(lv int, msg string, args ...interface{}) []byte {
	if writer.pattern != "" {
		out := bytes.NewBuffer(make([]byte, 0, 64))

		// Iterate over the fbs, replacing known formats
		for i, piece := range bytes.Split([]byte(writer.pattern), []byte("%")) {
			if i > 0 && len(piece) > 0 {
				switch piece[0] {
				case 'T':
					out.WriteString(time.Now().Format("2006-01-02 15:04:05.000"))
				case 'L':
					out.WriteString(levelLabel(lv))
				case 'C':
					out.WriteString(fmt.Sprintf("\x1b[%dm%s\x1b[0m", levelColor(lv), levelLabel(lv)))
				case 'M':
					//out.WriteString(fmt.Sprint(entry))
				case 'S':
					out.WriteString(fmt.Sprint(time.Now().Unix()))
				}
				if len(piece) > 1 {
					out.Write(piece[1:])
				}
			} else if len(piece) > 0 {
				out.Write(piece)
			}
		}
		out.WriteByte('\n')

		return out.Bytes()
	}

	mapEncoder := &mapEncoder{elems: make(map[string]interface{})}
	for _, f := range writer.fs {
		f.AddTo(mapEncoder)
	}
	fsString := ""
	for k, v := range mapEncoder.elems {
		fsString += fmt.Sprintf(" %s:%#v", k, v)
	}

	var f string
	if writer.color {
		f = fmt.Sprintf(
			writer.prefix+" (%d) \x1b[%dm%s [%s] \x1b[0m %-44s \n",
			os.Getpid(),
			levelColor(lv),
			time.Now().Format(timestampFormat),
			levelLabel(lv),
			fmt.Sprintf(msg+fsString+strings.Repeat(" %v:%v", len(args)/2), args...),
		)
	} else {
		f = fmt.Sprintf(
			writer.prefix+" (%d) %s [%s] %-44s \n",
			os.Getpid(),
			time.Now().Format(timestampFormat),
			levelLabel(lv),
			fmt.Sprintf(msg+fsString+strings.Repeat(" %v:%v", len(args)/2), args...),
		)
	}
	return []byte(f)
}

func (writer *ConsoleWriter) printf(lv int, format string, args ...interface{}) []byte {
	if writer.pattern != "" {
		out := bytes.NewBuffer(make([]byte, 0, 64))

		// Iterate over the fbs, replacing known formats
		for i, piece := range bytes.Split([]byte(writer.pattern), []byte("%")) {
			if i > 0 && len(piece) > 0 {
				switch piece[0] {
				case 'T':
					out.WriteString(time.Now().Format("2006-01-02 15:04:05.000"))
				case 'L':
					out.WriteString(levelLabel(lv))
				case 'C':
					out.WriteString(fmt.Sprintf("\x1b[%dm%s\x1b[0m", levelColor(lv), levelLabel(lv)))
				case 'M':
					//out.WriteString(fmt.Sprint(entry))
				case 'S':
					out.WriteString(fmt.Sprint(time.Now().Unix()))
				}
				if len(piece) > 1 {
					out.Write(piece[1:])
				}
			} else if len(piece) > 0 {
				out.Write(piece)
			}
		}
		out.WriteByte('\n')

		return out.Bytes()
	}

	var f string
	if writer.color {
		f = fmt.Sprintf(
			writer.prefix+" (%d) \x1b[%dm%s [%s] \x1b[0m %-44s \n",
			os.Getpid(),
			levelColor(lv),
			time.Now().Format(timestampFormat),
			levelLabel(lv),
			fmt.Sprintf(format, args...),
		)
	} else {
		f = fmt.Sprintf(
			writer.prefix+" (%d) %s [%s] %-44s \n",
			os.Getpid(),
			time.Now().Format(timestampFormat),
			levelLabel(lv),
			fmt.Sprintf(format, args...),
		)
	}
	return []byte(f)
}

// Write writes string into queue.
func (writer *ConsoleWriter) Write(str []byte) (n int, err error) {
	writer.queue <- str
	return
}

// Close closes writer.
func (writer *ConsoleWriter) Close() error {
	close(writer.queue)
	return nil
}

func levelColor(lvl int) (color int) {
	switch lvl {
	case DebugLevel:
		color = magenta
	case InfoLevel:
		color = blue
	case WarnLevel:
		color = yellow
	case ErrorLevel, PanicLevel, FatalLevel:
		color = red
	default:
		color = nocolor
	}

	return
}

func levelLabel(lvl int) (label string) {
	switch lvl {
	case DebugLevel:
		label = "DEBU"
	case InfoLevel:
		label = "INFO"
	case WarnLevel:
		label = "WARN"
	case ErrorLevel:
		label = "ERRO"
	case PanicLevel:
		label = "PANI"
	case FatalLevel:
		label = "FATA"
	default:
		label = "NONE"
	}

	return
}

func levelMap(lvl string) (lv int) {
	level := strings.ToUpper(strings.TrimSpace(lvl))
	switch level[:4] {
	case "DEBU":
		lv = DebugLevel
	case "INFO":
		lv = InfoLevel
	case "WARN":
		lv = WarnLevel
	case "ERRO":
		lv = ErrorLevel
	case "PANI":
		lv = PanicLevel
	case "FATA":
		lv = FatalLevel
	}

	return
}

// CheckErr checks error, error will be logged if it's not equal to nil.
func (writer *ConsoleWriter) CheckErr(err error, logFunc func(string, ...interface{})) (isErr bool) {
	return checkErr(err, logFunc)
}

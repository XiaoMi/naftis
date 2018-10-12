package wzap

import (
	"time"

	"go.uber.org/zap/zapcore"
)

type mapEncoder struct {
	elems map[string]interface{}
}

func (s *mapEncoder) AddArray(k string, v zapcore.ArrayMarshaler) error   { s.elems[k] = v; return nil }
func (s *mapEncoder) AddObject(k string, v zapcore.ObjectMarshaler) error { s.elems[k] = v; return nil }
func (s *mapEncoder) AddBool(k string, v bool)                            { s.elems[k] = v }
func (s *mapEncoder) AddBinary(k string, v []byte)                        { s.elems[k] = v }
func (s *mapEncoder) AddByteString(k string, v []byte)                    { s.elems[k] = v }
func (s *mapEncoder) AddComplex128(k string, v complex128)                { s.elems[k] = v }
func (s *mapEncoder) AddComplex64(k string, v complex64)                  { s.elems[k] = v }
func (s *mapEncoder) AddDuration(k string, v time.Duration)               { s.elems[k] = v }
func (s *mapEncoder) AddFloat64(k string, v float64)                      { s.elems[k] = v }
func (s *mapEncoder) AddFloat32(k string, v float32)                      { s.elems[k] = v }
func (s *mapEncoder) AddInt(k string, v int)                              { s.elems[k] = v }
func (s *mapEncoder) AddInt64(k string, v int64)                          { s.elems[k] = v }
func (s *mapEncoder) AddInt32(k string, v int32)                          { s.elems[k] = v }
func (s *mapEncoder) AddInt16(k string, v int16)                          { s.elems[k] = v }
func (s *mapEncoder) AddInt8(k string, v int8)                            { s.elems[k] = v }
func (s *mapEncoder) AddString(k string, v string)                        { s.elems[k] = v }
func (s *mapEncoder) AddTime(k string, v time.Time)                       { s.elems[k] = v }
func (s *mapEncoder) AddUint(k string, v uint)                            { s.elems[k] = v }
func (s *mapEncoder) AddUint64(k string, v uint64)                        { s.elems[k] = v }
func (s *mapEncoder) AddUint32(k string, v uint32)                        { s.elems[k] = v }
func (s *mapEncoder) AddUint16(k string, v uint16)                        { s.elems[k] = v }
func (s *mapEncoder) AddUint8(k string, v uint8)                          { s.elems[k] = v }
func (s *mapEncoder) AddUintptr(k string, v uintptr)                      { s.elems[k] = v }
func (s *mapEncoder) AddReflected(k string, v interface{}) error          { return nil }
func (s *mapEncoder) OpenNamespace(k string)                              {}

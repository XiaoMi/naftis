package handler

import (
	"os"
	"io"
	"github.com/xiaomi/naftis/src/api/service"
	"github.com/gin-gonic/gin"
	"mime/multipart"
	"github.com/spf13/viper"
	"istio.io/istio/pilot/pkg/kube/inject"
	"istio.io/istio/pilot/pkg/model"
)

// curl -F "config=@bookinfo.yaml" http://localhost:50000/inject/file
func InjectToFile(c *gin.Context) {
	// istio config 's file
	file, err := c.FormFile("config")
	if err != nil {
		c.Writer.Write([]byte(err.Error()+ "\n"))
		c.Writer.Flush()
	}

	tmp_path := viper.GetString("upload_tmp") + file.Filename
	defer func (){
		os.Remove(tmp_path)
	}()

	err = saveUploadedFile(file, tmp_path)
	if err != nil {
		c.Writer.Write([]byte(err.Error()+ "\n"))
		c.Writer.Flush()
	}

	var in *os.File
	var reader io.Reader

	in, err = os.Open(tmp_path)
	if err != nil {
		c.Writer.Write([]byte(err.Error()+ "\n"))
		c.Writer.Flush()
	}
	reader = in

	configYaml, err := service.IstioInfo.GetMeshConfigFromConfigMap()
	if err != nil {
		c.Writer.Write([]byte(err.Error()+ "\n"))
		c.Writer.Flush()
	}

	meshConfig,err := model.ApplyMeshConfigDefaults(configYaml)


	injectConfig, err := service.IstioInfo.GetInjectConfigFromConfigMap()
	if err != nil {
		c.Writer.Write([]byte(err.Error()+ "\n"))
		c.Writer.Flush()
	}

	inject.IntoResourceFile(injectConfig, meshConfig, reader, c.Writer)
}



func saveUploadedFile(file *multipart.FileHeader, dst string) error {
	src, err := file.Open()
	if err != nil {
		return err
	}
	defer src.Close()

	out, err := os.Create(dst)
	if err != nil {
		return err
	}
	defer out.Close()

	io.Copy(out, src)
	return nil
}

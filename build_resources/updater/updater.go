//go:generate goversioninfo -icon=resource/icon.ico -manifest=resource/goversioninfo.exe.manifest
package main

 import (
 	"fmt"
 	"log"
  "path/filepath"
 	"os"
 	"os/exec"
 	"time"
  "io"
  "io/ioutil"
	"net/http"
	"encoding/json"
  "archive/zip"
  "strings"
  "regexp"
  "syscall"
 )


func movefile(oldpath string, newpath string) error { //跨卷移动
  from, err := syscall.UTF16PtrFromString(oldpath)
  if err != nil {
      return err
  }
  to, err := syscall.UTF16PtrFromString(newpath)
  if err != nil {
      return err
  }
  return syscall.MoveFile(from, to)//windows API
  // return os.Rename(oldpath, newpath)
}

func getWorkingDirPath() string {
  dir, err := os.Getwd()
  if err != nil {
      panic(err)
  }
  fmt.Println("workingDirPath:", dir)
  return dir
}



func getAppInfo(url string) string {
  type AppInfo struct {
    Version string `json:"version"`
    Name string `json:"name"`
    Hash string `json:"hash"`
  }

  response, err := http.Get(url)
  if err != nil {
    fmt.Println(err)
	}
	defer response.Body.Close()
	var bodystr string
  if response.StatusCode == 200 {
    body, _ := ioutil.ReadAll(response.Body)
    bodystr = string(body)
  } else {
    bodystr = ""
  }
  fmt.Println(bodystr)
  var appInfo AppInfo
  err1 := json.Unmarshal([]byte(bodystr), &appInfo)
  if err1 != nil {
    fmt.Println(err1)
	}
  fmt.Println(appInfo)
  fmt.Println(appInfo.Name)
  return appInfo.Name;
}


func downloadFile(url string, dist string) {
	// 获取网络文件的数据流
	resp, err := http.Get(url)
	if err != nil {
    fmt.Println(err)
	}
	defer resp.Body.Close()
	// 读取数据流到内存中
	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		// 处理错误
	}
	// 将文件写入到指定目录
	err = ioutil.WriteFile(dist, data, 0644)
	if err != nil {
		// 处理错误
	}
}

func Unzip(src string, dest string) ([]string, error) {

  var filenames []string

  r, err := zip.OpenReader(src)
  if err != nil {
      return filenames, err
  }
  defer r.Close()

  for _, f := range r.File {

      // Store filename/path for returning and using later on
      fpath := filepath.Join(dest, f.Name)

      // Check for ZipSlip. More Info: http://bit.ly/2MsjAWE
      if !strings.HasPrefix(fpath, filepath.Clean(dest)+string(os.PathSeparator)) {
          return filenames, fmt.Errorf("%s: illegal file path", fpath)
      }

      filenames = append(filenames, fpath)

      if f.FileInfo().IsDir() {
          // Make Folder
          os.MkdirAll(fpath, os.ModePerm)
          continue
      }

      // Make File
      if err = os.MkdirAll(filepath.Dir(fpath), os.ModePerm); err != nil {
          return filenames, err
      }

      outFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
      if err != nil {
          return filenames, err
      }

      rc, err := f.Open()
      if err != nil {
          return filenames, err
      }

      _, err = io.Copy(outFile, rc)

      // Close the file without defer to close before next iteration of loop
      outFile.Close()
      rc.Close()

      if err != nil {
          return filenames, err
      }
  }
  return filenames, nil
}

func getExePath(path string) (string, string) {
  fileInfos, err := ioutil.ReadDir(path)
  if err != nil {
    fmt.Println(err)
    return "", ""
  }
  separator := string(os.PathSeparator)
  for _, fileInfo := range fileInfos {
      // 当前文件名
      currentFileName := fileInfo.Name()
      currentFilePath := path + separator + currentFileName
      if fileInfo.IsDir() {
        continue
      }
      fmt.Println(currentFileName)
      isIn, err := regexp.MatchString("[\u4e00-\u9fa5]{3,10}\\.exe", currentFileName)
      if err != nil {
          log.Fatalf("egexp.MatchString err : %v", err)
          continue
      }
      if isIn {
          return currentFileName, currentFilePath
      }
    }
  return  "", ""
}

func KillEXE(strEXEName string) bool {
	fmt.Println("kill调进程：", strEXEName)
	arg := []string{"/f", "/im", strEXEName}
	cmd := exec.Command("taskkill", arg...)
	if err := cmd.Run(); err != nil {
		fmt.Println("Error: ", err)
	}
	return true
}

type Configuration struct {
  UpdateUrl string `json:"updateUrl"`
}

func getConfig() Configuration {
  var conf Configuration
  // 打开文件
  jsonFile, _err := os.Open("./updaterConfig.json")
  if _err != nil {
		fmt.Println("error opening json file")
    return conf
  }
  defer jsonFile.Close()

	jsonData, err := ioutil.ReadAll(jsonFile)
  if err!= nil {
		fmt.Println("error reading json file")
		return conf
	}
  fmt.Println(jsonData)

	json.Unmarshal(jsonData,&conf)

  fmt.Println("updateUrl:" + conf.UpdateUrl)
  log.Println("updateUrl:" + conf.UpdateUrl)
  return conf
}


func main() {
 	args := os.Args

 	// prepare logger
 	logfile, err := os.OpenFile("updater.log", os.O_CREATE|os.O_WRONLY|os.O_TRUNC, 0644)
 	if err != nil {
 		log.Println(err)
 	}
 	defer logfile.Close()

 	logger := log.New(logfile, "[ qjkhdg/updater ]", log.LstdFlags)

  var updateAsar string
  var appAsar string
  var app string
 	if len(args) >= 3 {
 		updateAsar = args[1]
 		appAsar = args[2]
    if len(args) == 4 {
      app = args[3]
    }
  } else {
    config := getConfig()
    appName := getAppInfo(config.UpdateUrl + "update.json")
    logger.Printf("appInfo name %s\n", appName)
    workingDir := getWorkingDirPath()
    updateZip := filepath.Join(workingDir, "update.zip")
    downloadFile(config.UpdateUrl + appName, updateZip)
    Unzip(updateZip, filepath.Join(workingDir, "output"))
    updateAsar = filepath.Join(workingDir, "output", "update.bin")
    appAsar = filepath.Join(workingDir, "resources", "app.asar")
    logger.Printf("updateAsar %s\n appAsar %s\n", updateAsar, appAsar)
    appName, app = getExePath(workingDir)
    logger.Printf("appName %s\n appPath %s\n", appName, app)
    if appName != "" {
      KillEXE(appName)
    }
    time.Sleep(2 * time.Second)
  }

  logger.Printf("Will move %s to %s\n", updateAsar, appAsar)

  // check and replace app.asar
  _, updateAsarErr := os.Stat(updateAsar)
  if os.IsNotExist(updateAsarErr) {
    logger.Fatalf("Update.asar not exist.\n")
    fmt.Fprintf(os.Stderr, "Update.asar not exist.\n")
  } else {
    // wait 3 seconds for app exit
    time.Sleep(3 * time.Second)
    _, appAsarErr := os.Stat(appAsar)
    if !os.IsNotExist(appAsarErr) {
      os.Remove(appAsar)
    } else {
      logger.Fatalf("app.asar stat error.%s \n", appAsarErr)
      fmt.Fprintf(os.Stderr, "app.asar not exist.\n")
    }
    err := movefile(updateAsar, appAsar)
    if err != nil {
      logger.Printf("app rename failed with %s\n", err)
    }
    // err1 := os.Rename(updateAsar, appAsar)
    // if err != nil {
    //   logger.Printf("app rename failed with %s\n", err1)
    // }
    logger.Println("app.asar replacement is completed.")
  }

  // restart application
  if app != "" {
    cmd := exec.Command(app)
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr
    err := cmd.Run()
    if err != nil {
      logger.Printf("app execute failed with %s\n", err)
    }
  }
}


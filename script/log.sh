#! /bin/bash
################################################
## common log util
## author: Cavin.Lang
## date: 2021.09.16
################################################

function log() {
  local LOG_LEVEL="INFO"
  local CUR_TIME=$(TZ=Asia/Shanghai date +'%Y-%m-%d %H:%M:%S')
  echo -e "[$CUR_TIME] [$LOG_LEVEL] $*"
}

function log_ok() {
  local LOG_LEVEL="INFO"
  local CUR_TIME=$(TZ=Asia/Shanghai date +'%Y-%m-%d %H:%M:%S')
  echo -e "\033[0;32;1m[$CUR_TIME] [$LOG_LEVEL] $*\033[0m"
}

function log_red() {
  local LOG_LEVEL="INFO"
  local CUR_TIME=$(TZ=Asia/Shanghai date +'%Y-%m-%d %H:%M:%S')
  echo -e "\033[0;31;1m[$CUR_TIME] [$LOG_LEVEL] $*\033[0m"
}

function log_warn() {
  local LOG_LEVEL="WARN"
  local CUR_TIME=$(TZ=Asia/Shanghai date +'%Y-%m-%d %H:%M:%S')
  echo -e "\033[0;33;1m[$CUR_TIME] [$LOG_LEVEL] $*\033[0m"
}

function log_blue() {
  local LOG_LEVEL="INFO"
  local CUR_TIME=$(TZ=Asia/Shanghai date +'%Y-%m-%d %H:%M:%S')
  echo -e "\033[0;34;1m[$CUR_TIME] [$LOG_LEVEL] $*\033[0m"
}

function log_err() {
  local LOG_LEVEL="ERROR"
  local CUR_TIME=$(TZ=Asia/Shanghai date +'%Y-%m-%d %H:%M:%S')
  echo -e "\033[0;31;1m[$CUR_TIME] [$LOG_LEVEL] $*\033[0m"
}
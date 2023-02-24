#! /bin/bash
################################################
## gitlab-ci deploy
## author: Cavin.Lang
## date: 2022-11-14
################################################

BRANCH_RELEASE="release"
BRANCH_INT="INT"
BRANCH_INT2="INT2"

# input params
export CUR_BRANCH=$1
export PROJECT_NAME=$2
export CI_REGISTRY=$3
export DEPLOY_DIR=${4:-/home/mspbots/git}
export DEPLOY_NODE=$5
export DEPLOY_BRANCH=$6
export ACTIVE_PROFILE=$7
export DEPLOY_METHOD=$8

export PROJECT_DIR=$DEPLOY_DIR/$PROJECT_NAME
export DEPLOY_DIST_DIR=$DEPLOY_DIR/${PROJECT_NAME}_dist
export DEPLOY_DIST_OLD_DIR=$DEPLOY_DIR/${PROJECT_NAME}_dist_old
export DEPLOY_DIST_DIR_TEMP=$DEPLOY_DIR/${PROJECT_NAME}_dist_temp
export BACKUP_DIR=$DEPLOY_DIR/backup
export BACKUP_FILE=$BACKUP_DIR/${PROJECT_NAME}_dist.tgz
export PROJECT_URL=http://deploy_ui:HdKGd5m43dL@10.20.20.106/mspbots-ai/$PROJECT_NAME.git

# ================= users-managements->GitlabEventEnum Begin =================
export NOTICE_EVENT_START="DEPLOY_START"
export NOTICE_EVENT_END="DEPLOY_FINISHED"
# ================= users-managements->GitlabEventEnum END   =================
export DO_NOTICE="N"

CUR_DIR=$(cd "$(dirname "$0")" || exit; pwd)
source "$CUR_DIR"/log.sh

log_blue "==================== CUSTOM VARIABLES ====================>>>"
log_blue "CUR_BRANCH=[$CUR_BRANCH]"
log_blue "DEPLOY_BRANCH=[$DEPLOY_BRANCH]"
log_blue "PROJECT_NAME=[$PROJECT_NAME]"
log_blue "PROJECT_DIR=[$PROJECT_DIR]"
log_blue "CI_REGISTRY=[$CI_REGISTRY]"
log_blue "DEPLOY_NODE=[$DEPLOY_NODE]"
log_blue "DEPLOY_DIR=[$DEPLOY_DIR]"
log_blue "DEPLOY_METHOD=[$DEPLOY_METHOD]"
log_blue "BACKUP_DIR=[$BACKUP_DIR]"
log_blue "BACKUP_FILE=[$BACKUP_FILE]"
log_blue "PROJECT_URL=[$PROJECT_URL]"
log_blue "ACTIVE_PROFILE=[$ACTIVE_PROFILE]"
log_blue "<<<==================== CUSTOM VARIABLES ===================="

function notice_deploy() {
  local isNotice=$1
  if [[ "$isNotice" == "Y" ]]; then
    local noticeUrl=$2
    local clusterId=$3
    local action=$4
    local front=${5:-false}
    log_ok "##### Send websocket notice begin: noticeUrl=[$noticeUrl] clusterId=[$clusterId] action=[$action] #####"
    curl -X POST "http://$noticeUrl/sys/notice/deploy" \
    -H "Accept: application/json" \
    -H "Content-Type: application/json;charset=UTF-8" \
    -d "{
        \"clusterId\": $clusterId,
        \"service\": \"$PROJECT_NAME\",
        \"module\": \"$PROJECT_NAME\",
        \"hostname\": \"$(hostname)\",
        \"branch\": \"$CUR_BRANCH\",
        \"action\": \"$action\",
        \"front\": $front
    }"
    log_ok "##### Send websocket notice finished! #####"
  fi
}

#! /bin/bash
################################################
## gitlab-ci deploy
## author: Cavin.Lang
## date: 2022-11-14
################################################

CUR_DIR=$(cd "$(dirname "$0")" || exit; pwd)
CUR_NAME=${0%.*}
CLUSTER_ID=${CUR_NAME#*deploy}
CLUSTER_ID=${CLUSTER:-1}
source "$CUR_DIR"/base.sh "$1" "$2" "$3" "$4" "$5" "$6" "$7" "$8"
source "$CUR_DIR"/log.sh

NOTICE_URL="10.10.70.233:8089"
if [ "$CUR_BRANCH" = "$BRANCH_INT" ]; then
  NOTICE_URL="10.10.71.230:8089"
fi
log_ok "DO_NOTICE=[$DO_NOTICE]"
log_ok "CLUSTER_ID=[$CLUSTER_ID]"
log_ok "NOTICE_URL=[$NOTICE_URL]"


cd "$PROJECT_DIR" || exit
git checkout "$DEPLOY_BRANCH"

function start() {
  nohup npm run start >> /data/logs/"$PROJECT_NAME"/"$PROJECT_NAME".log 2>&1 &
}

ps -ef | grep -v grep | grep node | grep "$PROJECT_NAME"

# stop
function stop() {
#  notice_deploy "$DO_NOTICE" $NOTICE_URL "$CLUSTER_ID" "$NOTICE_EVENT_START" false
  for pid in $(ps -ef | grep -v grep | grep node | grep "$PROJECT_NAME" | awk '{print $2}')
  do
    log_red "Command: [kill $pid]"
    kill "$pid"
    sleep 3
  done
  sleep 2
}

function start() {
  nohup npm run start >> /data/logs/"$PROJECT_NAME"/"$PROJECT_NAME".log 2>&1 &
  sleep 5
#  notice_deploy "$DO_NOTICE" $NOTICE_URL "$CLUSTER_ID" "$NOTICE_EVENT_END" false
}

count=0
while [[ $(ps -ef | grep -v grep | grep node | grep "$PROJECT_NAME" | wc -l) -ne 0 ]]
do
  count=$(expr $count + 1)
  log_ok "Shutdown [$count]Nth ..."
  if [[ $count -gt 3 ]]; then
    log_err 'Shutdown failure, after 3 time retry!'
    log_err 'Please stop manually: [ps -ef | grep -v grep | grep node | grep '"$PROJECT_NAME"' | awk ''{print $2}'' | xargs kill]'
    exit 1
  fi

  stop
  sleep 3
done

start




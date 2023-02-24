#! /bin/bash
################################################
## gitlab-ci deploy
## author: Cavin.Lang
## date: 2022-11-14
################################################

CUR_DIR=$(cd "$(dirname "$0")" || exit; pwd)
source "$CUR_DIR"/base.sh "$1" "$2" "$3" "$4" "$5" "$6" "$7" "$8"
source "$CUR_DIR"/log.sh

mkdir -p "$DEPLOY_DIST_DIR"
mkdir -p /data/logs/"$PROJECT_NAME"
if [[ -d $PROJECT_DIR ]]; then
  log_blue "[$PROJECT_DIR] exists, backup before deploy..."
  mkdir -p "$BACKUP_DIR"
  tar -czPf "$BACKUP_FILE" "$DEPLOY_DIST_DIR"
  log_blue "Backup finished!"
else
  log_blue "Init git clone project [$PROJECT_DIR]..."
  cd "$DEPLOY_DIR" || exit
  git clone -b "$DEPLOY_BRANCH" "$PROJECT_URL"
fi

cd "$PROJECT_DIR" || exit
git checkout "$DEPLOY_BRANCH"
git pull && npm install

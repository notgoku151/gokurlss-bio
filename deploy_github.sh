#!/usr/bin/env bash
set -e

# Colors for terminal output
GOLD='\033[0;33m'
GREEN='\033[0;32m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

REPO_NAME="gokurlss-bio"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo -e "${GOLD}=====================================================${NC}"
echo -e "${GOLD}👑 GØKÛ 悟 (@gokurlss) — GitHub Deployment Script 🚀${NC}"
echo -e "${GOLD}=====================================================${NC}"

# Check for token from arg or environment
TOKEN="${1:-$GITHUB_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo -e "${CYAN}Please enter your GitHub Personal Access Token (with 'repo' scope):${NC}"
  read -s -p "GitHub Token: " TOKEN
  echo ""
fi

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Error: GitHub token is required.${NC}"
  exit 1
fi

echo -e "\n${CYAN}1. Authenticating with GitHub API...${NC}"
USER_DATA=$(curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" https://api.github.com/user)
GH_USER=$(echo "$USER_DATA" | grep -o '"login": *"[^"]*"' | head -n 1 | cut -d '"' -f 4)

if [ -z "$GH_USER" ]; then
  echo -e "${RED}Failed to authenticate. GitHub API response:${NC}"
  echo "$USER_DATA"
  exit 1
fi

echo -e "${GREEN}✓ Authenticated successfully as: ${GOLD}@$GH_USER${NC}"

echo -e "\n${CYAN}2. Checking or creating repository '${REPO_NAME}'...${NC}"
CREATE_RES=$(curl -s -w "\n%{http_code}" -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"description\":\"👑 Official Links for GØKÛ 悟 (@gokurlss) - TikTok Bio\",\"private\":false,\"has_pages\":true}")

HTTP_STATUS=$(echo "$CREATE_RES" | tail -n 1)

if [ "$HTTP_STATUS" -eq 201 ]; then
  echo -e "${GREEN}✓ Created new public repository: github.com/$GH_USER/$REPO_NAME${NC}"
elif [ "$HTTP_STATUS" -eq 422 ]; then
  echo -e "${GOLD}! Repository already exists, proceeding to push changes.${NC}"
else
  echo -e "${GOLD}! Note: HTTP $HTTP_STATUS received during repo creation, continuing...${NC}"
fi

echo -e "\n${CYAN}3. Committing latest files...${NC}"
cd "$PROJECT_DIR"
git add .
git commit -m "👑 Initial commit: GØKÛ 悟 (@gokurlss) TikTok bio website" || echo "Already committed."

echo -e "\n${CYAN}4. Setting up remote and pushing to main branch...${NC}"
git branch -M main
REMOTE_URL="https://${GH_USER}:${TOKEN}@github.com/${GH_USER}/${REPO_NAME}.git"

if git remote get-url origin >/dev/null 2>&1; then
  git remote set-url origin "$REMOTE_URL"
else
  git remote add origin "$REMOTE_URL"
fi

git push -u origin main

echo -e "${GREEN}✓ Successfully pushed to https://github.com/$GH_USER/$REPO_NAME${NC}"

echo -e "\n${CYAN}5. Enabling GitHub Pages for automatic live hosting...${NC}"
PAGES_RES=$(curl -s -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/vnd.github+json" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  https://api.github.com/repos/$GH_USER/$REPO_NAME/pages \
  -d '{"source":{"branch":"main","path":"/"}}')

PAGES_URL="https://${GH_USER}.github.io/${REPO_NAME}/"

echo -e "\n${GOLD}=====================================================${NC}"
echo -e "${GREEN}🚀 ALL DONE! YOUR BIO WEBSITE IS DEPLOYED!${NC}"
echo -e "${GOLD}• GitHub Repo : ${CYAN}https://github.com/$GH_USER/$REPO_NAME${NC}"
echo -e "${GOLD}• Live Website: ${GREEN}${PAGES_URL}${NC}"
echo -e "${GOLD}=====================================================${NC}"
echo -e "${GOLD}(Note: GitHub Pages may take 1-2 minutes to complete first build)${NC}\n"

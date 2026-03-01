# GitHub 배포 가이드 (mirinae-jp)

- **GitHub 저장소**: [dangunee/mirinae-jp](https://github.com/dangunee/mirinae-jp)
- **로컬 폴더**: `admin.mirinae.jp` (이 컴퓨터)

---

## 빠른 배포 (이미 저장소 연결된 경우)

변경 후 터미널에서:

```bash
cd /Users/dangunee/admin.mirinae.jp

git add .
git status   # 확인
git commit -m "변경 내용 요약"
git push origin main
```

Vercel 등에 연결돼 있으면 `git push` 후 자동 배포됩니다.

---

## 1. 로컬에서 Git 초기화 및 첫 커밋 (최초 1회)

터미널에서 프로젝트 폴더로 이동한 뒤 아래를 순서대로 실행하세요.

```bash
cd /Users/dangunee/mirinae

# Git 저장소 초기화
git init

# 모든 파일 스테이징 (.gitignore 제외 항목 반영)
git add .

# 첫 커밋
git commit -m "Initial commit: mirinae 정적 사이트 + 작문 트레이닝 iframe"
```

## 2. GitHub 저장소 만들기

1. [GitHub](https://github.com) 로그인
2. **New repository** 클릭
3. Repository name: 예) `mirinae` 또는 `mirinae-jp`
4. Public 선택, **Create repository** 클릭
5. 생성된 저장소 URL 복사 (예: `https://github.com/사용자명/mirinae.git`)

## 3. 원격 저장소 연결 및 푸시

```bash
# 원격 저장소 추가 (URL은 본인 저장소로 변경)
git remote add origin https://github.com/사용자명/mirinae.git

# 기본 브랜치 이름 설정 (필요 시)
git branch -M main

# 푸시
git push -u origin main
```

## 4. GitHub Pages로 사이트 배포 (선택)

정적 HTML을 무료로 호스팅하려면:

1. GitHub 저장소 → **Settings** → **Pages**
2. **Source**: Deploy from a branch
3. **Branch**: `main` (또는 `master`) 선택, 폴더 `/ (root)` 선택
4. **Save** 후 몇 분 뒤 `https://사용자명.github.io/mirinae/` 에서 접속 가능

> **참고**: 이 사이트는 `blog/`(WordPress), `blog.php` 등 서버 기능을 쓰므로 GitHub Pages만으로는 전체 기능이 동작하지 않을 수 있습니다. 정적 페이지만 배포하거나, 별도 호스팅(Netlify, Vercel, 기존 웹호스트)과 연동해 사용하는 것을 권장합니다.

## 5. 이후 업데이트 배포

수정 후 배포할 때:

```bash
git add .
git commit -m "변경 내용 요약"
git push
```

---

**이미 다른 폴더(예: admin.mirinae.jp)가 Git 저장소라면**, 해당 폴더에서 `git remote -v`로 GitHub 연결 여부를 확인한 뒤 위 3번부터 진행하면 됩니다.

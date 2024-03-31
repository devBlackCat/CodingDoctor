```markdown
# CodingDoctor

CodingDoctor는 Vue.js와 Firebase를 이용하여 개발된 코딩 학습 웹 애플리케이션입니다. 사용자는 다양한 코딩 문제를 반복적으로 풀어보며 프로그래밍 실력을 향상시킬 수 있습니다. 이 플랫폼은 Firebase Authentication을 사용하여 사용자 인증을 처리하고, Firebase Database를 활용하여 사용자의 학습 진행 상태와 성과를 저장합니다.

## 기능 목록

- **사용자 인증**: 이메일 및 비밀번호를 통한 로그인 및 회원가입 기능을 제공합니다. Firebase Authentication을 사용하여 안전하게 사용자 정보를 관리합니다.
- **문제 풀이**: 프론트엔드, 백엔드, 서버, 데이터베이스 등 다양한 프로그래밍 카테고리의 문제를 제공합니다. 사용자는 이 문제들을 풀어보며 학습할 수 있습니다.
- **성과 기록**: 사용자의 문제 풀이 성과를 Firebase Database에 저장합니다. 사용자는 언제든지 본인의 학습 진행 상태와 성과를 확인할 수 있습니다.
- **비밀번호 재설정**: 사용자가 비밀번호를 잊어버렸을 경우, 이메일을 통한 비밀번호 재설정 기능을 제공합니다.

## 사용 기술

- **Frontend**: Vue.js를 사용하여 동적인 사용자 인터페이스를 구현했습니다.
- **Authentication**: Firebase Authentication을 통해 사용자 인증 기능을 구현했습니다.
- **Database**: Firebase Database를 활용하여 사용자 데이터 및 성과 기록을 관리합니다.
- **Additional Tools**: Vue Router를 사용하여 SPA(Single Page Application) 라우팅 처리를 구현했습니다.

## 시작하기

이 프로젝트를 로컬 환경에서 실행하기 위해 다음 단계를 따라야 합니다:

1. 이 저장소를 클론합니다.
2. 프로젝트 디렉토리로 이동하여 필요한 npm 패키지를 설치합니다:
   ```
   npm install
   ```
3. Firebase 프로젝트를 설정하고, `firebaseConfig.js` 파일에 필요한 Firebase 설정을 추가합니다.
4. 애플리케이션을 시작합니다:
   ```
   npm run serve
   ```



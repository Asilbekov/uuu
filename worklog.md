---
Task ID: 1
Agent: Main Agent
Task: Fix hydration mismatch, start test error, and option E display

Work Log:
- Read all application files (page.tsx, api routes, schema, seed data)
- Identified hydration mismatch caused by useSyncExternalStore returning different values on server vs client
- Fixed hydration error by replacing useSyncExternalStore with useState + useEffect mount guard pattern
- Fixed start test error by passing selectedQuestionCount to api.createAttempt()
- Updated attempts POST route to accept and use totalQuestions parameter
- Updated attempts PUT route to use answers.length for totalQuestions instead of hardcoded test.questions.length
- Fixed option E not showing in test-taking page (changed ['A','B','C','D'] to ['A','B','C','D','E'] with null check)
- Fixed option E not showing in review answers section
- Allowed test submission without requiring all questions answered
- Verified build compiles successfully with no errors
- Verified API endpoints work (login, tests, attempt creation with totalQuestions)

Stage Summary:
- Hydration mismatch error is fixed using mounted state guard
- Start test error is fixed by correctly passing totalQuestions to attempt creation
- Option E questions now display correctly in both test-taking and review
- All questions are in one combined test (Chemistry: Complete Test) with 78 questions
- User can select how many questions to answer via the start-test page
- Build compiles successfully

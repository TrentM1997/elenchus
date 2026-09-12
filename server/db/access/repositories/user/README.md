# Why signup creates its own Supabase client

`UserWriteHandler.executeCreateUser()` deliberately creates a fresh Supabase
client for each signup. Do not replace `signupClient.auth.signUp(...)` with
`this.db.auth.signUp(...)` or move the signup client into a shared singleton.

## The behavior this prevents

Supabase's `auth.signUp()` does more than create an account. When signup returns
a session, the SDK also stores that session on the client that made the call.
Later database requests from that client can then use the new user's access
token instead of the server credentials the client was created with.

The repository database client is shared. `DbClient` passes the same underlying
Supabase instance to the user, article, bookmark, and other repositories.
Dependency injection passes that object along; it does not copy it or isolate
its authentication state.

For example, if Alice signed up through the shared database client, the next
article write through that client could run as Alice. Since ordinary users
cannot insert articles under our database policies, that server write could
fail. The problem starts inside `signUp()`, before the route sets any cookies.

During the refactor, a local check using the installed SDK and mocked HTTP
responses confirmed this behavior: a database request used the service key
before signup and the signup user's access token afterward. No real accounts
or database records were involved.

## The intended flow

1. The signup route calls `UserService.signUp(credentials)`.
2. `UserService` delegates to `UserWriteHandler.createUser(credentials)`.
3. The write handler creates an isolated `signupClient`, calls `auth.signUp()`,
   validates the response, and returns the user and session.
4. The route calls `req.auth.establishSession(session, res)` to set the browser's
   authentication cookies.

Account creation stays behind the service/repository API. Cookies stay at the
request boundary. The shared repository client never receives the signup
session.

The request's own auth client is another separate instance, created by
`configSessionHandler`. Setting cookies through that handler does not remove
session state from whichever client performed signup, which is why signup
needs its own instance too.

## Client configuration

The signup client uses `SUPABASE_URL` and `SUPABASE_PUBLIC_KEY` (the publishable
or legacy anon key), with:

```ts
auth: {
  persistSession: false,
  autoRefreshToken: false,
  detectSessionInUrl: false,
}
```

These options disable persistent session storage, automatic token refresh, and
browser URL session detection. **They do not prevent the client from holding a
session in memory. Creating a fresh instance for each signup is what provides
isolation.**

Creating this client on the server does not require moving signup into browser
code. Keep the service-role key reserved for trusted server database operations.

## Notes for future changes

- If client creation is moved into an injected factory for testing, the factory
  must return a fresh client for each signup operation.
- Do not try to clean up the shared client by signing out after signup. Other
  requests could use it in the meantime, and signing out could revoke the
  session just created for the user.
- At the time of this refactor, email confirmation is disabled and this flow
  expects signup to return a session. If confirmation is enabled later, update
  response validation and the route to accept successful account creation with
  no session and defer cookie establishment until login/confirmation.

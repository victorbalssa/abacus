## How to log and connect to your Firefly III instance?

### If you're using an external authentication provider like Authelia, OAuth Clients will not work. You can use Personal Access Tokens only.

![img_1.png](HELP/img_1.png)
1. Go to `/profile` 
2. Create a new Oauth client with redirect URI: `abacusfiiiapp://redirect`

![img.png](HELP/img.png)

3. Copy and paste `Oauth Client ID` it will be a number (required, Example: `4`).

4. No need to use the secret client but if you do so copy and paste it in the `Oauth Client Secret` field.

<img alt="img_2.jpeg" height="670" src="HELP/img_2.jpeg" width="300"/>

### Personal Access Token

create:

<img width="840" alt="image" src="https://github.com/victorbalssa/abacus/assets/12813321/f92c8bba-5c48-4b5c-b2be-5eddfb53e6f2">

copy:

<img width="823" alt="image" src="https://github.com/victorbalssa/abacus/assets/12813321/ae91cb88-b994-48ab-87b6-f77d11a99cbd">

paste:

<img width="390" alt="image" src="https://github.com/victorbalssa/abacus/assets/12813321/f8ea01bd-40c2-4f1f-ac95-6be4f2ae9a47">

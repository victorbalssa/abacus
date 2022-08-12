export type ContainerPropType = {
  navigation: { dispatch: (action) => void },
  route: { params: { payload, id: string } },
}

export type OauthConfigType = {
  oauthClientId: string,
  oauthClientSecret: string,
}

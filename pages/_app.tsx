import '../styles/globals.css'
import type { AppContext, AppProps } from 'next/app'
import Nav from '../components/nav'
import { AppWrapper } from '../wrappers/state'
import ironSessionOptions from '../lib/session-options'
import App from 'next/app'
import { getIronSession } from 'iron-session'
import { User } from '../lib/interfaces'
import Body from '../wrappers/body'

function MyApp({ Component, pageProps, user }: AppProps & { user:User }) {

  return (
      <AppWrapper userObj={user}>
        <Nav></Nav>
        <Body>
          <Component {...pageProps} />
        </Body>
      </AppWrapper>
  )
}

MyApp.getInitialProps = async (appContext:AppContext) => {
  const appProps = await App.getInitialProps(appContext);
  console.log('apelat');
  if (appContext.ctx.req && appContext.ctx.res) {
    const placeholder: User = (await getIronSession(
      appContext.ctx.req,
      appContext.ctx.res,
      ironSessionOptions,
    )).user;
    const user: User = placeholder === undefined ? null : placeholder;
    return {
      ...appProps,
      user
    };
  }
  return {
    ...appProps
  };
}


export default MyApp;

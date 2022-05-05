import { makeStyles } from '@material-ui/core/styles';
export default makeStyles((theme) => ({
  streams: {
    display: 'flex',
    justifyContent: 'center',
    width: '80vw',
    height: '100vh',
  },
  container: {
    width: '80vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'row',
  },
  infoCard: {
    width: '15vw',
    height: '100vh',
    // position: 'absolute',
    // right: '0',
  },
}));

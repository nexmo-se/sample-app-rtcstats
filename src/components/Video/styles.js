import { makeStyles } from '@material-ui/core/styles';
export default makeStyles((theme) => ({
  streams: {
    display: 'flex',
    justifyContent: 'center',
    width: '75vw',
    height: '90vh',
  },
  container: {
    width: '75vw',
    height: '90vh',
    display: 'flex',
    flexDirection: 'row',
  },
  infoCard: {
    width: '20vw',
    height: '100vh',
    // position: 'absolute',
    // right: '0',
  },
}));

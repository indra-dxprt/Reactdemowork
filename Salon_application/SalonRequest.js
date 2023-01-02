import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import {
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  InputBase,
  Button,
  IconButton,
  Collapse,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import SearchIcon from '@material-ui/icons/Search';
import DeleteForeverTwoToneIcon from '@material-ui/icons/DeleteForeverTwoTone';
import ListTwoToneIcon from '@material-ui/icons/ListTwoTone';
import VisibilityTwoToneIcon from '@material-ui/icons/VisibilityTwoTone';
import CloseIcon from '@material-ui/icons/Close';
import Salonlogo from '../../assets/img/salonlogo.svg';
import '../../assets/fonts/source-sans-pro-v14-latin-600.woff';
import Axios from '../../config/axios';
import Banner from '../../components/Banner/Banner';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: '#004B7F',
    color: theme.palette.common.white,
    fontSize: 14,
    fontFamily: "'source sans pro', 'sans-serif'",
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 300,
  },
  marg: {
    // marginTop: 100,
    margin: '70px 10px 10px 20px',
    // marginRight:20,
  },
  searchSec: {
    maxWidth: '100%',
  },
  searchField: {
    minWidth: '80%',
    // maxWidth: ,
  },
  iconButton: {
    // marginLeft: 50,
    position: 'relative',
    left: 10,
  },
  heading: {
    backgroundColor: '#004B7F',
    color: 'white',
    minHeight: 40,
    minWidth: 400,
    marginBottom: 50,
    fontFamily: "'source sans pro', 'sans-serif'",
  },
  h3: {
    marginLeft: 40,
    paddingTop: 10,
    fontSize: 16,
  },
  h3icon: {
    maxHeight: 30,
    maxWidth: 30,
    marginTop: 3,
    marginLeft: 5,
    position: 'relative',
    top: 70,
  },
  statusGreen: {
    height: 20,
    maxWidth: 150,
    padding: '0px 5px 0px 5px',
    fontWeight: 20,
    backgroundColor: '#4AC18E',
    borderRadius: 2,
  },
  statusOrange: {
    height: 20,
    maxWidth: 150,
    padding: '0px 5px 0px 5px',
    fontWeight: 20,
    backgroundColor: '#ff9019',
    borderRadius: 2,
  },
  statusRed: {
    height: 20,
    maxWidth: 150,
    padding: '0px 5px 0px 5px',
    fontWeight: 20,
    backgroundColor: '#ff3030',
    borderRadius: 2,
  },
  statusRow: {
    paddingTop: 2,
    color: 'white',
    fontSize: 10,
  },
  actionBtn: {
    margin: 1,
    // width:20
  },
});

const SalonRequest = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState();
  const [err, setErr] = useState();
  var [responseData, setResponseData] = useState([]);
  const history = useHistory();

  useEffect(() => {
    Axios.get('/admin/get_all_salons')
      .then((res) => {
        if (res.data.success == true) {
          const filteredData = res.data.data.filter(
            (d) => d.status == 'pending'
          );
          setResponseData(filteredData);
        } else {
          setResponseData([]);
        }
        // console.log(response);
      })
      .catch((err) => {
        history.push({
          pathname: '/login',
        });
        console.log(err);
      });
  }, []);

  const handleDelete = (salon) => {
    //
    Axios.delete(`admin/delete_salon/${salon.salon_id}`)
      .then((res) => {
        if (res.data.success === true) {
          const filteredData = responseData.filter(
            (d) => d.salon_id !== salon.salon_id
          );
          setResponseData(filteredData);
          setMsg('Salon deleted Successfully');
          setOpen(true);
        } else {
          setErr('Operation Failed');
          setOpen(true);
        }
      })
      .catch((err) => {
        history.push({
          pathname: '/login',
        });
        console.log(err);
      });
  };

  const handleStatusChange = (status, salons) => {
    const data = {
      salon_status: status,
      salon_id: salons.salon_id,
    };

    Axios.post('admin/update_salon_status', data)
      .then((res) => {
        if (res.data.success === true) {
          const temp = [...responseData];
          const index = temp.indexOf(salons);
          temp[index] = { ...salons };
          temp[index].status = status;
          setResponseData(temp);
        }
      })
      .catch((err) => {
        history.push({
          pathname: '/login',
        });
        console.log(err);
      });
  };

  const handleAlert = () => {
    if (msg) {
      setMsg();
      setOpen(false);
    }
    if (err) {
      setErr();
      setOpen(false);
    }
  };

  return (
    <Grid container>
      <Grid item md={12} lg={12} xl={12} className={classes.marg}>
        {/* <img src={Salonlogo} alt="" className={classes.h3icon} />
      <div className={classes.heading}>
        <h5 className={classes.h3}>Salons</h5>
      </div> */}
        <Banner title={'All Salons'} icon={Salonlogo} />
        <Collapse in={open}>
          <Alert
            className={classes.alert}
            severity={msg ? 'success' : err ? 'error' : 'info'}
            action={
              <IconButton aria-label='close' size='small' onClick={handleAlert}>
                <CloseIcon fontSize='inherit' />
              </IconButton>
            }
          >
            {msg ? msg : err ? err : ''}
          </Alert>
        </Collapse>
        {/* search bar */}
        <Grid container>
          <Grid item lg={8}></Grid>
          <Grid item lg={4}>
            <Paper component='form' elevation={2} className={classes.searchSec}>
              <InputBase
                className={classes.searchField}
                placeholder='   Search'
                inputProps={{ 'aria-label': 'search ' }}
              />
              <IconButton
                type='submit'
                className={classes.iconButton}
                aria-label='search'
              >
                <SearchIcon />
              </IconButton>
            </Paper>
          </Grid>
        </Grid>
        {/* end Search bar */}

        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label='customized table'>
            <TableHead>
              <TableRow>
                <StyledTableCell>S No.</StyledTableCell>
                <StyledTableCell align='center'>Salon Name</StyledTableCell>
                <StyledTableCell align='center'>Whatsapp.</StyledTableCell>
                <StyledTableCell align='center'>User</StyledTableCell>
                <StyledTableCell align='center'>Email</StyledTableCell>
                <StyledTableCell align='center'>Type</StyledTableCell>
                <StyledTableCell align='center'>Location</StyledTableCell>
                <StyledTableCell align='center'>Status</StyledTableCell>
                <StyledTableCell align='center'>action</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responseData.map((item, index) => (
                <StyledTableRow key={item.salon_id}>
                  <StyledTableCell component='th' scope='row'>
                    {index + 1}
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    {item.salon_name}
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    {item.whatsapp}
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    {item.first_name}&nbsp;{item.last_name}
                  </StyledTableCell>
                  <StyledTableCell align='center'>{item.email}</StyledTableCell>
                  <StyledTableCell align='center'>{item.type}</StyledTableCell>
                  <StyledTableCell align='center'>
                    {item.location}
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    <Box
                      component='div'
                      className={
                        item.status == 'active'
                          ? classes.statusGreen
                          : item.status == 'pending'
                          ? classes.statusOrange
                          : classes.statusRed
                      }
                    >
                      <Typography className={classes.statusRow}>
                        {item.status}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    <Box display='flex' component='div'>
                      <Link
                        to={{
                          pathname: '/edit_product',
                          state: { productId: item.product_id }, // your data array of objects
                        }}
                      >
                        <Button
                          variant='contained'
                          size='small'
                          color='primary'
                          className={classes.actionBtn}
                        >
                          <ListTwoToneIcon />
                        </Button>
                      </Link>

                      <Button
                        size='small'
                        variant='contained'
                        color='secondary'
                        className={classes.actionBtn}
                        onClick={() => {
                          handleDelete(item);
                        }}
                      >
                        <DeleteForeverTwoToneIcon />
                      </Button>
                    </Box>

                    <Link
                      to={{
                        pathname: '/view_product',
                        state: { productId: item.product_id }, // your data array of objects
                      }}
                    >
                      <Button
                        variant='contained'
                        size='small'
                        color='default'
                        className={classes.actionBtn}
                      >
                        <VisibilityTwoToneIcon />
                      </Button>
                    </Link>
                    {item.status === 'pending' ? (
                      <>
                        <Button
                          variant='outlined'
                          size='small'
                          color='default'
                          className={classes.actionBtn}
                          onClick={() => {
                            handleStatusChange('active', item);
                          }}
                        >
                          Activate
                        </Button>
                        <Button
                          variant='outlined'
                          size='small'
                          color='default'
                          className={classes.actionBtn}
                          onClick={() => {
                            handleStatusChange('decline', item);
                          }}
                        >
                          Decline
                        </Button>
                      </>
                    ) : item.status === 'active' ? (
                      <Button
                        variant='outlined'
                        size='small'
                        color='default'
                        className={classes.actionBtn}
                        onClick={() => {
                          handleStatusChange('deactive', item);
                        }}
                      >
                        Deactivate
                      </Button>
                    ) : item.status === 'deactive' ? (
                      <Button
                        variant='outlined'
                        size='small'
                        color='default'
                        className={classes.actionBtn}
                        onClick={() => {
                          handleStatusChange('active', item);
                        }}
                      >
                        Activate
                      </Button>
                    ) : (
                      ''
                    )}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    </Grid>
  );
};

export default SalonRequest;

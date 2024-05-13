'use client';

import {
  AttendanceParams,
  AttendancePercentageProps,
  AttendanceStatusListProps,
  TeacherAttendanceByDateParams,
} from '../utils/Interfaces';
import {
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import React, { useEffect } from 'react';
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import {
  attendanceInPercentageStatusList,
  attendanceStatusList,
  bulkAttendance,
  markAttendance,
} from '../services/AttendanceService';
import {
  formatDate,
  getMonthName,
  getTodayDate,
  shortDateFormat,
  formatSelectedDate
} from '../utils/Helper';

import { ATTENDANCE_ENUM } from '../utils/Helper';
import ArrowForwardSharpIcon from '@mui/icons-material/ArrowForwardSharp';
import AttendanceStatusListView from '../components/AttendanceStatusListView';
import Backdrop from '@mui/material/Backdrop';
import CloseIcon from '@mui/icons-material/Close';
import Divider from '@mui/material/Divider';
import ExtraSessionsCard from '@/components/ExtraSessionsCard';
import Fade from '@mui/material/Fade';
import Header from '../components/Header';
import Link from 'next/link';
import Loader from '../components/Loader';
import MarkAttendance from '../components/MarkAttendance';
import Modal from '@mui/material/Modal';
import OverviewCard from '@/components/OverviewCard';
import TimeTableCard from '@/components/TimeTableCard';
import TodayIcon from '@mui/icons-material/Today';
import WeekCalender from '@/components/WeekCalender';
import WeekDays from '@/components/WeekDays';
import { cohortList } from '../services/CohortServices';
import { getMyCohortMemberList } from '../services/MyClassDetailsService';
import { getTeacherAttendanceByDate } from '../services/AttendanceService';
import { useRouter } from 'next/navigation';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

interface State extends SnackbarOrigin {
  openModal: boolean;
}

interface DashboardProps {
  //   buttonText: string;
}

interface user {
  key: string;
}

interface cohort {
  cohortId: string;
  name: string;
  value: string;
}
// let userId = localStorage.getItem('userId');
let contextId: string = '';

const Dashboard: React.FC<DashboardProps> = () => {
  const [open, setOpen] = React.useState(false);
  // const [selfAttendanceDetails, setSelfAttendanceDetails] = React.useState(null);
  const [cohortsData, setCohortsData] = React.useState<Array<cohort>>([]);
  const [classId, setClassId] = React.useState('');
  const [userType, setUserType] = React.useState('student');
  const [cohortId, setCohortId] = React.useState(null);
  const [openMarkAttendance, setOpenMarkAttendance] = React.useState(false);
  const [openMarkUpdateAttendance, setOpenMarkUpdateAttendance] =
    React.useState(false);
  const [cohortMemberList, setCohortMemberList] = React.useState<Array<user>>(
    []
  );
  const [showDetails, setShowDetails] = React.useState(false);
  const [handleSaveHasRun, setHandleSaveHasRun] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState("");
  const [percentageAttendanceData, setPercentageAttendanceData] =
    React.useState(null);
  const [numberOfCohortMembers, setNumberOfCohortMembers] = React.useState(0);
  const [percentageAttendance, setPercentageAttendance] = React.useState<any>(null);
  const [currentDate, setCurrentDate] = React.useState(getTodayDate);
  const [bulkAttendanceStatus, setBulkAttendanceStatus] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [AttendanceMessage, setAttendanceMessage] = React.useState('');
  const [attendanceStatus, setAttendanceStatus] = React.useState('');
  const [isAllAttendanceMarked, setIsAllAttendanceMarked] =
    React.useState(false);
  const [showUpdateButton, setShowUpdateButton] = React.useState(false);
  const [state, setState] = React.useState<State>({
    openModal: false,
    vertical: 'top',
    horizontal: 'center',
  });
  const { vertical, horizontal, openModal } = state;

  const { t } = useTranslation();
  const router = useRouter();
  const limit = 100;
  const page = 0;
  // const userAttendance = [{ userId: localStorage.getItem('userId'), attendance: 'present' }];
  const attendanceDate = currentDate;
  let contextId = classId;
  //  const [TeachercontextId, setTeacherContextId] = React.useState("");
  const userTypeData: any = {
    Learners: 'student',
    // Self: 'self',
  };
  const userTypeArray = Object.keys(userTypeData);
  const report = false;
  const offset = 0;
  const theme = useTheme<any>();
  ``;
  const modalContainer = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 300,
    bgcolor: theme.palette.warning['A400'],
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  //API call to get center list
  useEffect(() => {
    const fetchCohortList = async () => {
      const userId = localStorage.getItem('userId');
      // const userId = '6d58d9c3-863f-484b-a81a-76901e9a6c9e'; //Hard Coded for testing purpose. TODO: replace by dynamic userId
      setLoading(true);
      try {
        if (userId) {
          let limit = 0;
          let page = 0;
          let filters = { userId: userId };
          const resp = await cohortList({ limit, page, filters });

          const extractedNames = resp?.data?.cohortDetails;
          localStorage.setItem(
            'parentCohortId',
            extractedNames?.[0].cohortData.parentId
          );
          //  setTeacherContextId(extractedNames[0].cohortData.parentId)

          const filteredData = extractedNames
            ?.map((item: any) => ({
              cohortId: item.cohortData.cohortId,
              parentId: item.cohortData.parentId,
              name: item.cohortData.name,
            }))
            ?.filter(Boolean);
          setCohortsData(filteredData);
          setClassId(filteredData?.[0].cohortId);
          setShowUpdateButton(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching  cohort list:', error);
        setLoading(false);
      }
    };
    // if (classesId != '') {
    fetchCohortList();
    // }
  }, []);

  //API for getting student list
  useEffect(() => {
    const getCohortMemberList = async () => {
      setLoading(true);
      // const parentCohortId = localStorage.getItem('parentCohortId');
      // const formattedDate: string = currentDate;
      try {
        if (classId) {
          //userId && parentCohortId
          let limit = 100;
          let page = 0;
          let filters = { cohortId: classId };
          const response = await getMyCohortMemberList({
            limit,
            page,
            filters,
          });
          const resp = response?.data?.userDetails;

          if (resp) {
            const nameUserIdArray = resp?.map((entry: any) => ({
              userId: entry.userId,
              name: entry.name,
            }));
            console.log('name..........', nameUserIdArray);
            if (nameUserIdArray && currentDate) {
              const userAttendanceStatusList = async () => {
                const attendanceStatusData: AttendanceStatusListProps = {
                  limit: 200,
                  page: 1,
                  filters: {
                    fromDate: currentDate,
                    toDate: currentDate,
                  },
                };
                const res = await attendanceStatusList(attendanceStatusData);
                const response = res?.data?.attendanceList;
                console.log('attendanceStatusList', response);
                if (nameUserIdArray && response) {
                  const getUserAttendanceStatus = (
                    nameUserIdArray: any[],
                    response: any[]
                  ) => {
                    const userAttendanceArray: {
                      userId: any;
                      attendance: any;
                    }[] = [];

                    nameUserIdArray.forEach((user) => {
                      const userId = user.userId;
                      const attendance = response.find(
                        (status) => status.userId === userId
                      );
                      if (attendance) {
                        userAttendanceArray.push({
                          userId,
                          attendance: attendance.attendance,
                        });
                      }
                    });

                    return userAttendanceArray;
                  };
                  const userAttendanceArray = getUserAttendanceStatus(
                    nameUserIdArray,
                    response
                  );
                  console.log('userAttendanceArray', userAttendanceArray);
                  if (nameUserIdArray && userAttendanceArray) {
                    const mergeArrays = (
                      nameUserIdArray: { userId: string; name: string }[],
                      userAttendanceArray: {
                        userId: string;
                        attendance: string;
                      }[]
                    ): {
                      userId: string;
                      name: string;
                      attendance: string;
                    }[] => {
                      const newArray: {
                        userId: string;
                        name: string;
                        attendance: string;
                      }[] = [];

                      // Iterate over nameUserIdArray
                      nameUserIdArray.forEach((user) => {
                        const userId = user.userId;
                        // Find corresponding entry in userAttendanceArray
                        const attendanceEntry = userAttendanceArray.find(
                          (entry) => entry.userId === userId
                        );
                        if (attendanceEntry) {
                          // If found, merge properties and push to newArray
                          newArray.push({
                            userId,
                            name: user.name,
                            attendance: attendanceEntry.attendance,
                          });
                        }
                      });
                      // setCohortMemberList(newArray); //Getting issue updating attendance regardless of cohort id for mark all
                      return newArray;
                    };
                    mergeArrays(nameUserIdArray, userAttendanceArray);
                  }
                }

                //Add logic to merge response2 and nameUserIdArray
                setCohortMemberList(nameUserIdArray);
                setNumberOfCohortMembers(nameUserIdArray?.length);
                setLoading(false);
              };
              userAttendanceStatusList();
            }
          }
          // const TeachercontextId = parentCohortId.replace(/\n/g, '');

          // const attendanceData: TeacherAttendanceByDateParams = {
          //   fromDate: formattedDate,
          //   toDate: formattedDate,
          //   filters: {
          //     userId,
          //     contextId: TeachercontextId,
          //   },
          // };
          // const response2 = await getTeacherAttendanceByDate(attendanceData);
          // if (response?.data?.length === 0) {
          //   setAttendanceStatus(ATTENDANCE_ENUM.NOT_MARKED);
          // } else {
          //   setAttendanceStatus(response2.data[0].attendance);
          // }
        }
      } catch (error) {
        console.error('Error fetching cohort list:', error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    if (classId.length) {
      getCohortMemberList();
    }
  }, [classId]);

  const showDetailsHandle = (dayStr: string) => {
    console.log(dayStr);
    setSelectedDate(formatSelectedDate(dayStr));
    setShowDetails(true);
  };

  const handleModalToggle = () => setOpen(!open);
  const handleMarkAttendanceModal = () =>
    setOpenMarkAttendance(!openMarkAttendance);
  const handleMarkUpdateAttendanceModal = () =>
    setOpenMarkUpdateAttendance(!openMarkUpdateAttendance);

  const handleCohortSelection = (event: SelectChangeEvent) => {
    setClassId(event.target.value as string);
    setHandleSaveHasRun(!handleSaveHasRun);
  };

  useEffect(() => {
    const getAttendaceData = async () => {
      try {
        const currentDate = new Date();
        const dayOfWeek = currentDate.getDay();
        const diffToMonday =
          currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        const startDate = new Date(currentDate.setDate(diffToMonday));
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        endDate.setHours(23, 59, 59, 999);
        const fromDateFormatted = shortDateFormat(startDate);
        const toDateFormatted = shortDateFormat(endDate);
        const attendanceRequest: AttendancePercentageProps = {
          limit: 2,
          page: 1,
          filters: {
            contextId: classId,
            fromDate: fromDateFormatted,
            toDate: toDateFormatted,
            scope: userType,
          },
          facets: ['attendanceDate'],
        };
        const response =
          await attendanceInPercentageStatusList(attendanceRequest);
        console.log('response', response?.data?.result?.attendanceDate);
        setTimeout(() => {
          setPercentageAttendanceData(response?.data?.result?.attendanceDate);
        });

        const attendanceDates = response?.data?.result?.attendanceDate;

        const formattedAttendanceData: any = {};

        // Loop through each attendance date
        Object.keys(attendanceDates).forEach((date) => {
          const attendance = attendanceDates[date];
          const present = attendance.present || 0;
          const absent = attendance.absent || 0;
          const totalStudents =
            attendance.present_percentage === '100.00'
              ? present
              : present + absent;

          formattedAttendanceData[date] = {
            date: date,
            present_students: present,
            total_students: totalStudents,
            present_percentage:
              parseFloat(attendance.present_percentage) ||
              100 - parseFloat(attendance.absent_percentage),
            absent_percentage:
              parseFloat(attendance.absent_percentage) ||
              100 - parseFloat(attendance.present_percentage),
          };
          console.log('formattedAttendanceData', formattedAttendanceData);
          setPercentageAttendance(formattedAttendanceData);
        });
      } catch (error) {
        console.log(error);
      }
    };

    getAttendaceData();
  }, [classId, handleSaveHasRun]);

  const handleUserTypeChange = async (event: SelectChangeEvent) => {
  
    setUserType(event.target.value as string);
    setHandleSaveHasRun(!handleSaveHasRun);
  };

  const submitAttendance = async (date: string, status: string) => {
    const parentCohortId = localStorage.getItem('parentCohortId');

    const formattedDate: string = currentDate;
    //console.log(date, status);
    // if (userId && parentCohortId) {
    //   const TeachercontextId = parentCohortId.replace(/\n/g, '');

    //   const attendanceData: AttendanceParams = {
    //     attendanceDate: date,
    //     attendance: status,
    //     userId,
    //     contextId: TeachercontextId,
    //   };
    //   setLoading(true);
    //   try {
    //     const response = await markAttendance(attendanceData);
    //     if (response) {
    //       setAttendanceMessage(t('ATTENDANCE.ATTENDANCE_MARKED_SUCCESSFULLY'));

    //       //  const TeachercontextId = parentCohortId.replace(/\n/g, '');

    //       const attendanceData: TeacherAttendanceByDateParams = {
    //         fromDate: formattedDate,
    //         toDate: formattedDate,
    //         filters: {
    //           userId,
    //           contextId: TeachercontextId,
    //         },
    //       };
    //       const response = await getTeacherAttendanceByDate(attendanceData);
    //       if (response?.data?.length === 0) {
    //         setAttendanceStatus(ATTENDANCE_ENUM.NOT_MARKED);
    //       } else {
    //         setAttendanceStatus(response.data[0].attendance);
    //       }
    //     }
    //     setLoading(false);
    //   } catch (error) {
    //     setAttendanceMessage(t('ATTENDANCE.ATTENDANCE_MARKED_UNSUCCESSFULLY'));
    //     console.error('error', error);
    //     setLoading(false);
    //   }
    // }
  };

  const submitBulkAttendanceAction = (
    isBulkAction: boolean,
    status: string,
    id?: string | undefined
  ) => {
    const updatedAttendanceList = cohortMemberList?.map((user: any) => {
      if (isBulkAction) {
        user.attendance = status;
        setBulkAttendanceStatus(status);
      } else {
        setBulkAttendanceStatus('');
        if (user.userId === id) {
          user.attendance = status;
        }
      }
      return user;
    });
    setCohortMemberList(updatedAttendanceList);
    const hasEmptyAttendance = () => {
      const allAttendance = updatedAttendanceList.some(
        (user) => user.attendance === ''
      );
      setIsAllAttendanceMarked(!allAttendance);
      if (!allAttendance) {
        setShowUpdateButton(true);
      }
    };
    hasEmptyAttendance();
  };
  const viewAttendanceHistory = () => {
    router.push('/user-attendance-history'); //Check Route
  };

  const handleSave = () => {
    handleModalToggle();
    const userAttendance = cohortMemberList?.map((user: any) => {
      return {
        userId: user.userId,
        attendance: user.attendance,
      };
    });
    if (userAttendance) {
      const data = {
        attendanceDate: selectedDate,
        contextId,
        userAttendance,
      };
      const markBulkAttendance = async () => {
        setLoading(true);
        try {
          const response = await bulkAttendance(data);
          // console.log(`response bulkAttendance`, response?.responses);
          // const resp = response?.data;
          // console.log(`data`, data);
          setShowUpdateButton(true);
          handleModalToggle()
          setLoading(false);
          setHandleSaveHasRun(true);
        } catch (error) {
          console.error('Error fetching  cohort list:', error);
          setLoading(false);
        }
        handleClick({ vertical: 'bottom', horizontal: 'center' })();
      };
      markBulkAttendance();
    }
  };

  useEffect(() => {
    let userId = localStorage.getItem('userId'); //Hard coded for testing purpose: TODO: Remove it later and add dynamic userId
    //setContextId('17a82258-8b11-4c71-8b93-b0cac11826e3') // this one is for testing purpose
    const fetchUserDetails = async () => {
      try {
        const parentCohortId = localStorage.getItem('parentCohortId');

        const today: Date = new Date();
        const year: number = today.getFullYear();
        let month: number | string = today.getMonth() + 1; // Month is zero-based, so we add 1
        let day: number | string = today.getDate();

        // Pad single-digit months and days with a leading zero
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        const formattedDate: string = `${year}-${month}-${day}`;

        if (userId && parentCohortId) {
          const TeachercontextId = parentCohortId.replace(/\n/g, '');

          const attendanceData: TeacherAttendanceByDateParams = {
            fromDate: formattedDate,
            toDate: formattedDate,
            filters: {
              userId,
              contextId: TeachercontextId,
            },
          };
          const response = await getTeacherAttendanceByDate(attendanceData);
          if (response?.data?.length === 0) {
            setAttendanceStatus(ATTENDANCE_ENUM.NOT_MARKED);
          }
          // else {
          //   setAttendanceStatus(response?.data[0]?.attendance);
          // }
        }
      } catch (Error) {
        console.error(Error);
      }
    };
    fetchUserDetails();
  }, []);

  const handleClick = (newState: SnackbarOrigin) => () => {
    setState({ ...newState, openModal: true });
  };
  const handleClose = () => {
    setState({ ...state, openModal: false });
  };

  const todayDate = new Date().toISOString().split('T')[0];
  console.log(percentageAttendance);
  const currentAttendance: any = percentageAttendance?.[todayDate];
  // let currentPercentAttendance = 'N/A';
  const presentPercentage = parseFloat(currentAttendance?.present_percentage);

  // Determine the color based on presentPercentage value
  let pathColor; // Default color (green)
  if (!isNaN(presentPercentage)) {
    if (presentPercentage < 25) {
      pathColor = '#BA1A1A'; // Less than 25% - Red color
    } else if (presentPercentage < 50) {
      pathColor = '#987100'; // Less than 50% - Purple color
    } else {
      pathColor = '#06A816'; // Less than 50% - Purple color
    }
  }
  return (
    <Box minHeight="100vh" className="linerGradient">
      <Header />
      <Typography textAlign={'left'} fontSize={'22px'} m={'1rem'}>
        {t('DASHBOARD.DASHBOARD')}
      </Typography>
      {loading && (
        <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
      )}
      <Box
        sx={{ bgcolor: theme.palette.warning['A900'], paddingBottom: '20px' }}
      >
        <Box display={'flex'} flexDirection={'column'} padding={'1rem'}>
          <Box display={'flex'} justifyContent={'space-between'}>
            <Typography variant="h2" sx={{ fontSize: '14px' }}>
              {t('DASHBOARD.DAY_WISE_ATTENDANCE')}
            </Typography>
            <Box
              className="calenderTitle flex-center"
              display={'flex'}
              sx={{
                cursor: 'pointer',
                color: theme.palette.secondary.main,
                gap: '2px',
              }}
              onClick={viewAttendanceHistory}
            >
              <Typography marginBottom={'0px'}>{getMonthName()}</Typography>
              <TodayIcon />
            </Box>
          </Box>

          <Box sx={{ mt: 0.6 }}>
            <Box sx={{ minWidth: 120, gap: '15px' }} display={'flex'}>
              <FormControl
                className="drawer-select"
                sx={{ my: 1, width: '40%' }}
              >
                <Select
                  value={userType}
                  onChange={handleUserTypeChange}
                  displayEmpty
                  inputProps={{ 'aria-label': 'Without label' }}
                  className="SelectLanguages fs-14 fw-500"
                  style={{
                    borderRadius: '0.5rem',
                    color: theme.palette.warning['200'],
                    width: '100%',
                    marginBottom: '0rem',
                  }}
                >
                  {userTypeArray.length !== 0 ? (
                    userTypeArray.map((user) => (
                      <MenuItem
                        key={userTypeData[user]}
                        value={userTypeData[user]}
                      >
                        {user}
                      </MenuItem>
                    ))
                  ) : (
                    <Typography style={{ fontWeight: 'bold' }}>
                      {t('COMMON.NO_DATA_FOUND')}
                    </Typography>
                  )}
                </Select>
              </FormControl>
              {userType == 'student' ? (
                <FormControl
                  className="drawer-select"
                  sx={{ m: 1, width: '60%' }}
                >
                  <Select
                    value={classId}
                    onChange={handleCohortSelection}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    className="SelectLanguages fs-14 fw-500"
                    style={{
                      borderRadius: '0.5rem',
                      color: theme.palette.warning['200'],
                      width: '100%',
                      marginBottom: '0rem',
                    }}
                  >
                    {cohortsData?.length !== 0 ? (
                      cohortsData?.map((cohort) => (
                        <MenuItem key={cohort.cohortId} value={cohort.cohortId}>
                          {cohort.name}
                        </MenuItem>
                      ))
                    ) : (
                      <Typography style={{ fontWeight: 'bold' }}>
                        {t('COMMON.NO_DATA_FOUND')}
                      </Typography>
                    )}
                  </Select>
                </FormControl>
              ) : null}
            </Box>
          </Box>
          <WeekCalender
            showDetailsHandle={showDetailsHandle}
            data={percentageAttendanceData}
          />
          <Box
            border={'1px solid black'}
            height={'auto'}
            width={'auto'}
            padding={'1rem'}
            borderRadius={'1rem'}
            bgcolor={theme.palette.warning['A200']}
            textAlign={'left'}
            margin={'15px 0 0 0 '}
          >
            <Stack
              direction="row"
              spacing={1}
              marginTop={1}
              justifyContent={'space-between'}
            >
              {userType == 'student' ? (
                <Box display={'flex'}>
                  {/* <Typography sx = {{color: theme.palette.warning['A400']}}>{t('DASHBOARD.NOT_MARKED')}</Typography> */}
                  {/* <Typography sx = {{color: theme.palette.warning['A400']}} fontSize={'0.8rem'}>{t('DASHBOARD.FUTURE_DATE_CANT_MARK')}</Typography>
                   */}
                  <Box
                    width={'25px'}
                    height={'2rem'}
                    marginTop={'0.25rem'}
                    margin={'5px'}
                  >
                    <CircularProgressbar
                      value={currentAttendance?.present_percentage}
                      styles={buildStyles({
                        textColor: pathColor,
                        pathColor: pathColor,
                        trailColor: '#E6E6E6',
                      })}
                      strokeWidth={15}
                    />
                  </Box>
                  <Box>
                    <Typography
                      sx={{ color: theme.palette.warning['A400'] }}
                      variant="h6"
                      className="word-break"
                    >
                      {currentAttendance?.present_percentage}{' '}
                      {t('DASHBOARD.PERCENT_ATTENDANCE')}
                    </Typography>
                    <Typography
                      sx={{ color: theme.palette.warning['A400'] }}
                      variant="h6"
                      className="word-break"
                    >
                      ({percentageAttendance?.[todayDate]?.present_students}/
                      {percentageAttendance?.[todayDate]?.total_students}){' '}
                      {t('DASHBOARD.PRESENT_STUDENTS')}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box>
                  {/* <Typography sx = {{color: theme.palette.warning['A400']}}>{t('DASHBOARD.NOT_MARKED')}</Typography> */}
                  {/* <Typography sx = {{color: theme.palette.warning['A400']}} fontSize={'0.8rem'}>{t('DASHBOARD.FUTURE_DATE_CANT_MARK')}</Typography>
                   */}
                  {/* <Typography
                sx={{ color: theme.palette.warning['A400'] }}
                variant="h6"
              >
                {t('ATTENDANCE.PRESENT')}
              </Typography> */}
                  <Typography
                    sx={{ color: theme.palette.warning['A400'] }}
                    variant="h6"
                    className="word-break"
                  >
                    {t('ATTENDANCE.ON_LEAVE')}
                  </Typography>
                </Box>
              )}
              <Button
                variant="contained"
                color="primary"
                style={{
                  minWidth: '33%',
                  height: '2.5rem',
                  padding: theme.spacing(1),
                }}
                onClick={
                  userType == 'student'
                    ? handleModalToggle
                    : handleMarkAttendanceModal
                }
              >
                {t('COMMON.MARK')}
              </Button>
            </Stack>
          </Box>

          {/* Student Attendance Modal */}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleModalToggle}
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            slotProps={{
              backdrop: {
                timeout: 500,
              },
            }}
          >
            <Fade in={open}>
              <Box
                sx={{
                  ...modalContainer,
                  borderColor: theme.palette.warning['A400'],
                  padding: '15px 10px 0 10px',
                }}
                borderRadius={'1rem'}
                height={'80%'}
              >
                <Box height={'100%'} width={'100%'}>
                  <Box display={'flex'} justifyContent={'space-between'}>
                    <Box marginBottom={'0px'}>
                      <Typography
                        variant="h2"
                        component="h2"
                        marginBottom={'0px'}
                        fontWeight={'500'}
                        fontSize={'16px'}
                        sx={{ color: theme.palette.warning['A200'] }}
                      >
                        {t('COMMON.MARK_STUDENT_ATTENDANCE')}
                      </Typography>
                      <Typography
                        variant="h2"
                        sx={{
                          paddingBottom: '10px',
                          color: theme.palette.warning['A200'],
                          fontSize: '14px',
                        }}
                        component="h2"
                      >
                        {formatDate(selectedDate)}
                      </Typography>
                    </Box>
                    <Box onClick={() => handleModalToggle()}>
                      <CloseIcon
                        sx={{
                          cursor: 'pointer',
                          color: theme.palette.warning['A200'],
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ height: '1px', background: '#D0C5B4' }}></Box>
                  {loading && (
                    <Loader
                      showBackdrop={true}
                      loadingText={t('COMMON.LOADING')}
                    />
                  )}

                  <Typography
                    sx={{
                      marginTop: '10px',
                      fontSize: '12px',
                      color: theme.palette.warning['A200'],
                    }}
                  >
                    {t('ATTENDANCE.TOTAL_STUDENTS', {
                      count: numberOfCohortMembers,
                    })}
                  </Typography>
                  {cohortMemberList && cohortMemberList?.length != 0 ? (
                    <Box
                      height={'58%'}
                      sx={{ overflowY: 'scroll', marginTop: '10px' }}
                    >
                      <Box>
                        <AttendanceStatusListView
                          isEdit={true}
                          isBulkAction={true}
                          bulkAttendanceStatus={bulkAttendanceStatus}
                          handleBulkAction={submitBulkAttendanceAction}
                        />
                        {cohortMemberList?.map(
                          (
                            user: any //cohort member list should have userId, attendance, name
                          ) => (
                            <AttendanceStatusListView
                              key={user.userId}
                              userData={{
                                userId: user.userId,
                                attendance: user.attendance,
                                attendanceDate: currentDate,
                                name: user.name,
                              }}
                              isEdit={true}
                              bulkAttendanceStatus={bulkAttendanceStatus}
                              handleBulkAction={submitBulkAttendanceAction}
                            />
                          )
                        )}
                      </Box>
                      <Box
                        position={'absolute'}
                        bottom="10px"
                        display={'flex'}
                        gap={'20px'}
                        flexDirection={'row'}
                        justifyContent={'space-evenly'}
                        marginBottom={0}
                        sx={{ background: '#fff', padding: '15px 0 0 0' }}
                      >
                        <Button
                          variant="outlined"
                          style={{ width: '8rem' }}
                          disabled={isAllAttendanceMarked ? false : true}
                          onClick={() =>
                            submitBulkAttendanceAction(true, '', '')
                          }
                        >
                          {' '}
                          {t('COMMON.CLEAR_ALL')}
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ width: '8rem' }}
                          disabled={isAllAttendanceMarked ? false : true}
                          onClick={handleSave}
                        >
                          {showUpdateButton
                            ? t('COMMON.UPDATE')
                            : t('COMMON.SAVE')}
                        </Button>
                      </Box>
                    </Box>
                  ) : (
                    <Typography
                      style={{ fontWeight: 'bold', marginLeft: '1rem' }}
                    >
                      {t('COMMON.NO_DATA_FOUND')}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Fade>
          </Modal>
        </Box>

        {/* Self Attendance Component */}
        <MarkAttendance
          isOpen={openMarkAttendance}
          isSelfAttendance={true}
          date={currentDate}
          currentStatus={attendanceStatus}
          handleClose={handleMarkAttendanceModal}
          handleSubmit={submitAttendance}
          message={AttendanceMessage}
        />
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openModal}
          onClose={handleClose}
          className="sample"
          autoHideDuration={5000}
          key={vertical + horizontal}
          message={t('ATTENDANCE.ATTENDANCE_MARKED_SUCCESSFULLY')}
          // action={action}
        />

        <Divider sx={{ borderBottomWidth: '0.1rem' }} />

        {/* Overview Card Section */}
        <Box
          display={'flex'}
          flexDirection={'column'}
          gap={'1rem'}
          padding={'1rem'}
        >
          <Stack
            direction={'row'}
            justifyContent={'space-between'}
            alignItems={'center'}
            padding={'2px'}
          >
            <Box>
              <Typography className="fs-14" variant="h2">
                {t('DASHBOARD.OVERVIEW')}
              </Typography>
            </Box>
            <Box
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              sx={{ color: theme.palette.secondary.main }}
            >
              <Link className="flex-center fs-14 text-decoration" href={'/'}>
                {t('DASHBOARD.MORE_DETAILS')}{' '}
                <ArrowForwardSharpIcon sx={{ height: '18px' }} />
              </Link>
            </Box>
          </Stack>
          {loading && (
            <Loader showBackdrop={true} loadingText={t('COMMON.LOADING')} />
          )}
        </Box>
        {userType == 'Students' ? (
          <Box display={'flex'} className="card_overview">
            <Grid container spacing={0}>
              <Grid item xs={5}>
                <OverviewCard label="Centre Attendance" value="71%" />
              </Grid>
              <Grid item xs={7}>
                <OverviewCard
                  label="Low Attendance Students"
                  value="Bharat Kumar, Ankita Kulkarni, +3 more"
                />
              </Grid>
            </Grid>
          </Box>
        ) : (
          <OverviewCard label="My Overall Attendance" value="85%" />
        )}
      </Box>
      <Box sx={{ background: '#fff', padding: '1rem' }}>
        <Typography textAlign={'left'} fontSize={'0.8rem'}>
          {t('DASHBOARD.MY_TIMETABLE')}
        </Typography>
        <WeekDays useAbbreviation={false} />
        <TimeTableCard
          subject={'Science'}
          instructor={'Khapari Dharmu'}
          time={'10 am - 1 pm'}
        />
        <TimeTableCard
          subject={'Home Science'}
          instructor={'Khapari Dharmu'}
          time={'2 pm - 5 pm'}
        />
        <Typography textAlign={'left'} fontSize={'0.8rem'} m={'1rem'}>
          {t('DASHBOARD.UPCOMING_EXTRA_SESSION')}
        </Typography>
        <ExtraSessionsCard
          subject={'Science'}
          instructor={'Upendra Kulkarni'}
          dateAndTime={'07-may-2024'}
          meetingURL={
            'https://meet.google.com/fqz-ftoh-dynfqz-ftoh-dynfqz-ftoh-dyn'
          }
          onEditClick={() => {
            console.log('edit');
          }}
          onCopyClick={() => {
            console.log('copy');
          }}
        />
      </Box>
    </Box>
  );
};

export default Dashboard;

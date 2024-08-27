import Header from '@/components/Header';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, Grid, IconButton, InputBase, MenuItem, Paper, Select, Step, StepLabel, Stepper } from '@mui/material';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import ArrowDropDownSharpIcon from '@mui/icons-material/ArrowDropDownSharp';
import React, { useEffect, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import EastIcon from '@mui/icons-material/East';
import HorizontalLinearStepper from '@/components/HorizontalLinearStepper';
import PieChartGraph from '@/components/PieChartGraph';



const BoardEnrollment = () => {
    const theme = useTheme<any>();
    const { t } = useTranslation();

    return (
        <>
            <Header />

            <Box sx={{ px: '16px', color: theme.palette.warning['A200'], fontSize: '22px', fontWeight: '400', mt: 3 }}>
                {t('BOARD_ENROOLMENT.BOARD_ENROLLMENT')}
            </Box>

            <Grid container>
                <Grid item xs={12} md={8} lg={6}>
                    <Box sx={{ px: '16px', mt: 2 }}>
                        <Paper
                            component="form"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius: '100px',
                                background: theme.palette.warning.A700,
                                boxShadow: 'none',
                            }}
                        >
                            <InputBase
                                sx={{ ml: 3, flex: 1, mb: '0', fontSize: '14px' }}
                                placeholder={t('COMMON.SEARCH_STUDENT') + '..'}
                                inputProps={{ 'aria-label': t('ASSESSMENTS.SEARCH_STUDENT') }}
                            />
                            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </Box>
                </Grid>
            </Grid>

            <Box sx={{ px: '16px' }}>
                <Grid container sx={{ mt: '20px' }}>
                    <Grid item xs={8}>
                        <Box>
                            <FormControl className="drawer-select" sx={{ width: '100%' }}>
                                <Select
                                    displayEmpty
                                    style={{
                                        borderRadius: '0.5rem',
                                        color: theme.palette.warning['200'],
                                        width: '100%',
                                        marginBottom: '0rem',
                                    }}
                                >
                                    <MenuItem value="All Centers">
                                        All Centers   {/*will come form API */}
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    </Grid>
                    <Grid sx={{ display: 'flex', justifyContent: 'flex-end' }} xs={4} item>
                        <Button
                            sx={{
                                color: theme.palette.warning.A200,
                                borderRadius: '10px',
                                fontSize: '14px',
                            }}
                            endIcon={<ArrowDropDownSharpIcon />}
                            size="small"
                            variant="outlined"
                        >
                            {t('COMMON.SORT_BY')}
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <PieChartGraph/>


            <Grid container sx={{ mt: 4, px: '16px' }} spacing={2}>
                <Grid item xs={12} md={6} lg={6} xl={4}>
                    <Box sx={{ border: `1px solid ${theme.palette.warning['A100']}`, p: '12px 16px', borderRadius: '8px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ fontSize: '16px', fontWeight: '400', color: '#1F1B13' }}>Aanya Gupta</Box>
                            <EastIcon sx={{ color: '#1F1B13' }} />
                        </Box>
                        <Box sx={{ color: '#7C766F', fontWeight: '500', fontSize: '12px', mt: .5 }}>
                            Khapari Dharmu (Chimur, Chandrapur) {/*will come from API*/}
                        </Box>
                        <Box mt={2}>
                            <HorizontalLinearStepper />
                        </Box>
                    </Box>
                </Grid>
               
            </Grid>
        </>
    );
};

export async function getStaticProps({ locale }: any) {
    return {
        props: {
            ...(await serverSideTranslations(locale, ['common'])),
        },
    };
}

export default BoardEnrollment;

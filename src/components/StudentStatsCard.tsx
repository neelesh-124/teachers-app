import { Box, Typography } from '@mui/material';

import React from 'react';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

interface StudentStatsCard {
  label1: string;
  value1: string;
  label2: boolean;
  value2: string;
}

const StudentStatsCard: React.FC<StudentStatsCard> = ({
  label1,
  value1,
  label2,
  value2,
}) => {
  const theme = useTheme<any>();
  const { t } = useTranslation();

  return (
    <Box
      gap="5rem"
      border="1px solid #D0C5B4" //Add color from colorScheme
      borderRadius="1rem"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="white"
      margin="0px"
      flexDirection={'row'}
      sx={{ padding: '1rem' }}
    >
      <Box>
        <Typography fontSize={'11px'} fontWeight={600} marginBottom={'4px'}>
          {label1}
        </Typography>
        <Typography
          fontSize="16px"
          fontWeight={500}
          lineHeight="16px"
          marginBottom={'5px'}
        >
          {value1}
        </Typography>
      </Box>

      {label2 ? (
        <Typography
          fontWeight="bold"
          lineHeight="1rem"
          sx={{ color: theme.palette.warning['400'] }}
          marginBottom={'0px'}
          fontSize="16px"
        >
          {t('PROFILE.HELD_ON')}&nbsp;
          {value2}
        </Typography>
      ) : null}
    </Box>
  );
};

export default StudentStatsCard;

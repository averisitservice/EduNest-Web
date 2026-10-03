import { useState, useEffect } from 'react';
import {
  Box,
  Link,
  Table,
  Button,
  Dialog,
  Tooltip,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  CircularProgress,
  TableContainer,
} from '@mui/material';
import ApiService from 'src/services/ApiService';
import { Iconify } from 'src/components/iconify';
import { fNumber } from 'src/utils/format-number';

export function FeeHistoryDialog({ open, onClose, student }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !student) return;
    let active = true;
    setLoading(true);
    (async () => {
      const res = await ApiService.getFeeHistoryAsync(student.studentId);
      if (active) setHistory(res && res.data ? res.data : []);
      if (active) setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [open, student]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        Payment History — {student && student.studentName ? student.studentName : ''}
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress />
          </Box>
        ) : history.length === 0 ? (
          <Box sx={{ py: 6, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No data found
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Receipt</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Mode</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell>Collected By</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {history.map((p) => (
                  <TableRow key={p.feePaymentId} hover>
                    <TableCell>
                      {p && p.receiptUrl ? (
                        <Tooltip title="Click to open receipt PDF" arrow>
                          <Link
                            href={p.receiptUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            underline="hover"
                            sx={{
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 0.5,
                              fontWeight: 600,
                            }}
                          >
                            {p.receiptNo ? p.receiptNo : 'Receipt'}
                          </Link>
                        </Tooltip>
                      ) : (
                        (p && p.receiptNo) ? p.receiptNo : '-'
                      )}
                    </TableCell>
                    <TableCell>{p && p.paymentDate ? p.paymentDate : '-'}</TableCell>
                    <TableCell>{p && p.paymentMode ? p.paymentMode : '-'}</TableCell>
                    <TableCell align="right">{p && p.amount ? fNumber(p.amount) : '0'}</TableCell>
                    <TableCell>{p && p.collectedBy ? p.collectedBy : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Card,
  Chip,
  Link,
  Stack,
  Button,
  Select,
  Tooltip,
  Divider,
  MenuItem,
  IconButton,
  Typography,
  CircularProgress,
} from '@mui/material';
import { paths } from 'src/routes/paths';
import ApiService from 'src/services/ApiService';
import dateHelper from 'src/utils/dateHelper';
import { toast } from 'src/components/snackbar';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DashboardContent } from 'src/layouts/dashboard';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { NoteFormDialog } from '../note-form-dialog';

function getClassLabel(option) {
  if (!option) return '';
  return option.sectionName
    ? `${option.className} - ${option.sectionName}`
    : option.className || '';
}

function classKey(option) {
  if (!option) return '';
  return `${option.classId}-${option.sectionId !== null && option.sectionId !== undefined ? option.sectionId : 'null'}`;
}

export function NotesView() {
  const [classSections, setClassSections] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formItem, setFormItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);

  useEffect(() => {
    async function loadClasses() {
      const res = await ApiService.getAllClassMasterSectionsAsync();
      const list = res && res.data ? res.data : [];
      setClassSections(list);
      if (list.length > 0) setSelectedClass(list[0]);
    }
    loadClasses();
  }, []);

  useEffect(() => {
    if (!selectedClass) {
      setSubjects([]);
      return;
    }
    (async () => {
      const res = await ApiService.getClassSubjectsAsync(selectedClass.classId);
      setSubjects(res && res.data ? res.data : []);
    })();
  }, [selectedClass]);

  const loadItems = useCallback(async () => {
    if (!selectedClass) {
      setItems([]);
      return;
    }
    setLoading(true);
    const res = await ApiService.getNoteListAsync(selectedClass.classId, selectedClass.sectionId);
    setItems(res && res.data ? res.data : []);
    setLoading(false);
  }, [selectedClass]);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleSelectClass = (value) => {
    setSelectedClass(classSections.find((c) => classKey(c) === value) || null);
  };

  const openNew = () => {
    setFormItem(null);
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setFormItem(item);
    setFormOpen(true);
  };

  const handleDelete = async (item) => {
    if (!item) return;
    const res = await ApiService.deleteNoteAsync(item.noteId);
    if (res && res.data) {
      toast.success('Deleted.');
      loadItems();
    } else if (res && res.errors && res.errors.length) {
      toast.error(res.errors[0].msg);
    }
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Notes"
        links={[
          { name: 'Dashboard', href: '' },
          { name: 'Notes', href: paths.dashboard.note.root },
        ]}
        action={
          <Button
            variant="contained"
            color="primary"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openNew}
            disabled={!selectedClass}
          >
            New Note
          </Button>
        }
        sx={{ mb: 4 }}
      />

      <Card sx={{ mb: 3, p: 2 }}>
        <Select
          size="small"
          value={classKey(selectedClass)}
          onChange={(e) => handleSelectClass(e.target.value)}
          displayEmpty
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="" disabled>
            <em>Select Class & Section</em>
          </MenuItem>
          {classSections.map((option) => (
            <MenuItem key={classKey(option)} value={classKey(option)}>
              {getClassLabel(option)}
            </MenuItem>
          ))}
        </Select>
      </Card>

      <Card>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              No notes posted yet.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={2} sx={{ p: 2 }}>
            {items.map((item) => (
              <Card key={item.noteId} variant="outlined" sx={{ p: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ flexGrow: 1, pr: 2 }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      alignItems="center"
                      flexWrap="wrap"
                      sx={{ mb: 0.5 }}
                    >
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {item.title}
                      </Typography>
                      {item.subjectName && <Chip size="small" label={item.subjectName} />}
                    </Stack>
                    {item.description && (
                      <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', whiteSpace: 'pre-line' }}
                      >
                        {item.description}
                      </Typography>
                    )}
                    {item.attachmentUrl && (
                      <Link
                        href={item.attachmentUrl}
                        target="_blank"
                        rel="noopener"
                        variant="body2"
                        sx={{ mt: 0.5, display: 'inline-block' }}
                      >
                        <Iconify
                          icon="solar:paperclip-bold"
                          width={14}
                          sx={{ mr: 0.5, verticalAlign: 'middle' }}
                        />
                        Attachment
                      </Link>
                    )}
                  </Box>
                  <Stack direction="row" spacing={0.5}>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(item)}>
                        <Iconify icon="solar:pen-bold" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => setDeleteItem(item)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
                <Divider sx={{ my: 1.5 }} />
                <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                  {item.updatedBy ? `By ${item.updatedBy}` : ''}
                  {item.updatedDate ? ` • ${dateHelper.formatDateTime(item.updatedDate)}` : ''}
                </Typography>
              </Card>
            ))}
          </Stack>
        )}
      </Card>

      <NoteFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        item={formItem}
        selectedClass={selectedClass}
        subjects={subjects}
        onSuccess={loadItems}
      />

      <ConfirmDialog
        open={Boolean(deleteItem)}
        onClose={() => setDeleteItem(null)}
        title="Delete"
        content={
          deleteItem && deleteItem.title
            ? `Are you sure you want to delete "${deleteItem.title}"?`
            : 'Are you sure you want to delete this item?'
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              handleDelete(deleteItem);
              setDeleteItem(null);
            }}
          >
            Delete
          </Button>
        }
      />
    </DashboardContent>
  );
}

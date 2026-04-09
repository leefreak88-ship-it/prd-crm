import { useMemo, useState } from 'react';
import { Button, Form, Image, Input, InputNumber, Modal, Popconfirm, Space, Table, Typography, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useShareQuery } from '@/hooks/share/useShareQuery';
import {
  useCreateShareMutation,
  useDeleteShareMutation,
  useUpdateShareMutation
} from '@/hooks/share/useShareMutation';
import { uploadFiles } from '@/services/upload/api';
import type { ShareModel, ShareTemplate } from '@/services/share/types';

interface ShareFormState {
  open: boolean;
  mode: 'create' | 'edit';
  current?: ShareTemplate;
}

export function ShareTable() {
  const [form] = Form.useForm<ShareModel>();
  const [modalState, setModalState] = useState<ShareFormState>({ open: false, mode: 'create' });
  const [image1List, setImage1List] = useState<UploadFile[]>([]);
  const [image2List, setImage2List] = useState<UploadFile[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const { data = [], isLoading } = useShareQuery();
  const createMutation = useCreateShareMutation();
  const updateMutation = useUpdateShareMutation();
  const deleteMutation = useDeleteShareMutation();

  const columns: ColumnsType<ShareTemplate> = useMemo(
    () => [
      { title: '模板ID', dataIndex: 'id', width: 180 },
      { title: '模板名称', dataIndex: 'shareModelName', width: 180 },
      { title: '模板标题', dataIndex: 'shareModelTitle', width: 220 },
      { title: '模板类型', dataIndex: 'shareModelType', width: 120, render: (value?: number) => value ?? '-' },
      {
        title: '主图',
        dataIndex: 'shareModelImage1',
        width: 120,
        render: (value?: string) => value ? <Image width={80} src={value} /> : '-'
      },
      {
        title: '副图',
        dataIndex: 'shareModelImage2',
        width: 120,
        render: (value?: string) => value ? <Image width={80} src={value} /> : '-'
      },
      {
        title: '操作',
        width: 160,
        render: (_, record) => (
          <Space>
            <Button type="link" onClick={() => openEditModal(record)}>
              编辑
            </Button>
            <Popconfirm title="确认删除该模板吗？" onConfirm={() => onDelete(record.id || '')} okText="确认" cancelText="取消">
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    ],
    []
  );

  const buildImageList = (id: string, url?: string): UploadFile[] => {
    if (!url) return [];
    return [{ uid: id, name: '模板图片', status: 'done', url }];
  };

  const createUploadHandler = (
    fieldName: 'shareModelImage1' | 'shareModelImage2',
    setList: React.Dispatch<React.SetStateAction<UploadFile[]>>
  ): UploadProps['customRequest'] => {
    return async (options) => {
      setImageUploading(true);
      try {
        const uploadFile = options.file as File;
        const result = await uploadFiles({ files: uploadFile });
        const uploaded = result.successList[0];
        if (!uploaded?.fileUrl) {
          throw new Error('上传失败，请重试');
        }
        form.setFieldsValue({ [fieldName]: uploaded.fileUrl });
        setList([
          {
            uid: uploaded.fileId || `${Date.now()}`,
            name: uploaded.fileName || uploadFile.name,
            status: 'done',
            url: uploaded.fileUrl
          }
        ]);
        options.onSuccess?.(uploaded);
      } catch (error) {
        options.onError?.(error as Error);
      } finally {
        setImageUploading(false);
      }
    };
  };

  const onUploadImage1 = createUploadHandler('shareModelImage1', setImage1List);
  const onUploadImage2 = createUploadHandler('shareModelImage2', setImage2List);

  const openCreateModal = () => {
    setModalState({ open: true, mode: 'create' });
    form.setFieldsValue({
      shareModelName: '',
      shareModelTitle: '',
      shareModelType: 1,
      shareModelImage1: '',
      shareModelImage2: ''
    });
    setImage1List([]);
    setImage2List([]);
  };

  const openEditModal = (record: ShareTemplate) => {
    setModalState({ open: true, mode: 'edit', current: record });
    form.setFieldsValue({
      id: record.id,
      shareModelName: record.shareModelName,
      shareModelTitle: record.shareModelTitle,
      shareModelType: record.shareModelType,
      shareModelImage1: record.shareModelImage1,
      shareModelImage2: record.shareModelImage2
    });
    setImage1List(buildImageList(record.id || 'img1', record.shareModelImage1));
    setImage2List(buildImageList(record.id || 'img2', record.shareModelImage2));
  };

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (modalState.mode === 'create') {
      await createMutation.mutateAsync(values);
      message.success('新增模板成功');
    } else if (modalState.current?.id) {
      await updateMutation.mutateAsync({ ...values, id: modalState.current.id });
      message.success('编辑模板成功');
    }
    setModalState({ open: false, mode: 'create' });
  };

  const onDelete = async (id: string) => {
    if (!id) {
      return;
    }
    await deleteMutation.mutateAsync(id);
    message.success('删除模板成功');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <Typography.Title level={4} className="!mb-0">
          分享模板管理
        </Typography.Title>
        <Button type="primary" onClick={openCreateModal}>
          新增模板
        </Button>
      </div>
      <Table rowKey="id" loading={isLoading} columns={columns} dataSource={data} pagination={{ pageSize: 8 }} />
      <Modal
        title={modalState.mode === 'create' ? '新增模板' : '编辑模板'}
        open={modalState.open}
        onOk={onSubmit}
        onCancel={() => {
          setModalState({ open: false, mode: 'create' });
          setImage1List([]);
          setImage2List([]);
          setImageUploading(false);
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending || imageUploading}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="模板名称" name="shareModelName" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item label="模板标题" name="shareModelTitle" rules={[{ required: true, message: '请输入模板标题' }]}>
            <Input placeholder="请输入模板标题" />
          </Form.Item>
          <Form.Item label="模板类型" name="shareModelType" rules={[{ required: true, message: '请输入模板类型' }]}>
            <InputNumber className="!w-full" min={0} precision={0} />
          </Form.Item>
          <Form.Item name="shareModelImage1" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="主图">
            <Upload
              accept=".jpg,.jpeg,.png"
              listType="picture-card"
              maxCount={1}
              customRequest={onUploadImage1}
              fileList={image1List}
              onChange={({ fileList }) => setImage1List(fileList)}
              onRemove={() => {
                form.setFieldsValue({ shareModelImage1: '' });
                return true;
              }}
            >
              {image1List.length >= 1 ? null : '上传图片'}
            </Upload>
          </Form.Item>
          <Form.Item name="shareModelImage2" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="副图">
            <Upload
              accept=".jpg,.jpeg,.png"
              listType="picture-card"
              maxCount={1}
              customRequest={onUploadImage2}
              fileList={image2List}
              onChange={({ fileList }) => setImage2List(fileList)}
              onRemove={() => {
                form.setFieldsValue({ shareModelImage2: '' });
                return true;
              }}
            >
              {image2List.length >= 1 ? null : '上传图片'}
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

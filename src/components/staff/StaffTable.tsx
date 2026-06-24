import { useMemo, useState } from 'react';
import { Button, Form, Image, Input, Modal, Popconfirm, Select, Space, Table, Typography, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import Compressor from 'compressorjs';
import {
  useCreateStaffMutation,
  useDeleteStaffMutation,
  useUpdateStaffMutation
} from '@/hooks/staff/useStaffMutation';
import { useStaffQuery } from '@/hooks/staff/useStaffQuery';
import { uploadFiles } from '@/services/upload/api';
import type { ChatterReq, Chatters } from '@/services/chatter/types';

interface StaffFormState {
  open: boolean;
  mode: 'create' | 'edit';
  current?: Chatters;
}

// 聊手表格组件：包含列表、添加、编辑、删除操作
export function StaffTable() {
  const [form] = Form.useForm<ChatterReq>();
  const [modalState, setModalState] = useState<StaffFormState>({ open: false, mode: 'create' });
  const [avatarImageList, setAvatarImageList] = useState<UploadFile[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const { data = [], isLoading } = useStaffQuery();
  const createMutation = useCreateStaffMutation();
  const updateMutation = useUpdateStaffMutation();
  const deleteMutation = useDeleteStaffMutation();

  // 列配置：映射聊手姓名、手机号、微信号、状态、备注与操作
  const columns: ColumnsType<Chatters> = useMemo(
    () => [
      {
        title: '聊手姓名',
        dataIndex: 'chatHandsName',
        width: 180
      },
      { title: '手机号', dataIndex: 'chatHandsPhone' },
      { title: '微信号', dataIndex: 'chatHandsWx' },
      {
        title: '头像',
        dataIndex: 'chatHandsWxAvatar',
        width: 80,
        render: (value?: string) => (
          <Image
            width={60}
            src={value || ''}
            preview={false}
            alt="头像"
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6ZAAABRklEQVR4Xu3QMQEAAADCoPVPbQhfoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOA1v9QAATX68/0AAAAASUVORK5CYII="
          />
        )
      },
      { title: '状态', dataIndex: 'status', width: 120, render: (value) => (value === 1 ? '启用' : '停用') },
      { title: '备注', dataIndex: 'remark' },
      {
        title: '操作',
        width: 160,
        render: (_, record) => (
          <Space>
            <Button type="link" onClick={() => openEditModal(record)}>
              编辑
            </Button>
            <Popconfirm
              title="确认删除该聊手吗？"
              okText="确认"
              cancelText="取消"
              onConfirm={() => onDelete(record.id || '')}
            >
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

  // 打开新增弹窗：初始化表单默认值
  const openCreateModal = () => {
    setModalState({ open: true, mode: 'create' });
    form.setFieldsValue({
      chatHandsName: '',
      chatHandsPhone: '',
      chatHandsWx: '',
      chatHandsWxAvatar: '',
      remark: '',
      status: 1
    });
    setAvatarImageList([]);
  };

  // 打开编辑弹窗：回填当前记录
  const openEditModal = (record: Chatters) => {
    setModalState({ open: true, mode: 'edit', current: record });
    form.setFieldsValue({
      chatHandsName: record.chatHandsName,
      chatHandsPhone: record.chatHandsPhone,
      chatHandsWx: record.chatHandsWx,
      chatHandsWxAvatar: record.chatHandsWxAvatar,
      remark: record.remark,
      status: record.status ?? 1
    });
    if (record.chatHandsWxAvatar) {
      setAvatarImageList([
        {
          uid: record.id || 'avatar-image',
          name: '头像',
          status: 'done',
          url: record.chatHandsWxAvatar
        }
      ]);
      return;
    }
    setAvatarImageList([]);
  };

  const onUploadAvatar: UploadProps['customRequest'] = async (options) => {
    setImageUploading(true);
    try {
      const uploadFile = options.file as File;
      
      // 使用 compressor.js 压缩图片
      const compressedFile = await new Promise<File>((resolve, reject) => {
        new Compressor(uploadFile, {
          quality: 0.8,
          maxWidth: 500,
          maxHeight: 500,
          success(result) {
            resolve(new File([result], uploadFile.name, { type: result.type }));
          },
          error(err) {
            reject(err);
          }
        });
      });

      const result = await uploadFiles({ files: compressedFile });
      const uploaded = result.successList[0];
      if (!uploaded?.fileUrl) {
        throw new Error('上传失败，请重试');
      }
      form.setFieldsValue({ chatHandsWxAvatar: uploaded.fileUrl });
      setAvatarImageList([
        {
          uid: uploaded.fileId || `${Date.now()}`,
          name: uploaded.fileName || uploadFile.name,
          status: 'done',
          url: uploaded.fileUrl
        }
      ]);
      options.onSuccess?.(uploaded);
      form.setFieldValue(
        'chatHandsWxAvatar',
        uploaded.fileUrl
      );
    } catch (error) {
      options.onError?.(error as Error);
    } finally {
      setImageUploading(false);
    }
  };

  const onRemoveAvatar = () => {
    form.setFieldsValue({ chatHandsWxAvatar: '' });
    return true;
  };

  // 保存聊手：根据模式决定新增或编辑
  const onSubmit = async () => {
    const values = await form.validateFields();
    if (modalState.mode === 'create') {
      await createMutation.mutateAsync(values);
      message.success('新增聊手成功');
    } else if (modalState.current) {
      await updateMutation.mutateAsync({ id: modalState.current.id || '', payload: values });
      message.success('编辑聊手成功');
    }
    setModalState({ open: false, mode: 'create' });
  };

  // 删除聊手：执行删除并提示结果
  const onDelete = async (id: string) => {
    if (!id) return;
    await deleteMutation.mutateAsync(id);
    message.success('删除成功');
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <Typography.Title level={4} className="!mb-0">
          聊手列表
        </Typography.Title>
        <Button type="primary" onClick={openCreateModal}>
          新增聊手
        </Button>
      </div>
      <Table
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 8 }}
        className="flex-1"
      />
      <Modal
        title={modalState.mode === 'create' ? '新增聊手' : '编辑聊手'}
        open={modalState.open}
        onOk={onSubmit}
        onCancel={() => setModalState({ open: false, mode: 'create' })}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form layout="vertical" form={form}>
          <Form.Item label="聊手姓名" name="chatHandsName" rules={[{ required: true, message: '请输入聊手姓名' }]}>
            <Input placeholder="请输入聊手姓名" />
          </Form.Item>
          <Form.Item label="手机号" name="chatHandsPhone" rules={[{ required: true, message: '请输入手机号' }]}>
            <Input placeholder="请输入手机号" />
          </Form.Item>
          <Form.Item label="微信号" name="chatHandsWx" rules={[{ required: true, message: '请输入微信号' }]}>
            <Input placeholder="请输入微信号" />
          </Form.Item>
          <Form.Item label="头像">
            <Upload
              fileList={avatarImageList}
              listType="picture"
              maxCount={1}
              accept=".jpg,.jpeg,.png,.gif,.webp"
              customRequest={onUploadAvatar}
              onChange={({ fileList }) => setAvatarImageList(fileList)}
              onRemove={onRemoveAvatar}
              disabled={imageUploading}
            >
              {avatarImageList.length < 1 && (
                <Button loading={imageUploading}>上传头像</Button>
              )}
            </Upload>
          </Form.Item>
          <Form.Item
            name="chatHandsWxAvatar"
            hidden
          >
            <Input />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select
              options={[
                { label: '启用', value: 1 },
                { label: '停用', value: 0 }
              ]}
            />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

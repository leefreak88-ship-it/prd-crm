import { useMemo, useState } from 'react';
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Space, Table, Typography, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useShareQuery } from '@/hooks/share/useShareQuery';
import {
  useCreateShareMutation,
  useDeleteShareMutation,
  useUpdateShareMutation
} from '@/hooks/share/useShareMutation';
import type { ShareModel, ShareTemplate } from '@/services/share/types';

interface ShareFormState {
  open: boolean;
  mode: 'create' | 'edit';
  current?: ShareTemplate;
}

export function ShareTable() {
  const [form] = Form.useForm<ShareModel>();
  const [modalState, setModalState] = useState<ShareFormState>({ open: false, mode: 'create' });
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
      { title: '主图地址', dataIndex: 'shareModelImage1', ellipsis: true },
      { title: '副图地址', dataIndex: 'shareModelImage2', ellipsis: true },
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

  const openCreateModal = () => {
    setModalState({ open: true, mode: 'create' });
    form.setFieldsValue({
      shareModelName: '',
      shareModelTitle: '',
      shareModelType: 1,
      shareModelImage1: '',
      shareModelImage2: ''
    });
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
        onCancel={() => setModalState({ open: false, mode: 'create' })}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
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
          <Form.Item label="主图地址" name="shareModelImage1">
            <Input placeholder="请输入主图地址" />
          </Form.Item>
          <Form.Item label="副图地址" name="shareModelImage2">
            <Input placeholder="请输入副图地址" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

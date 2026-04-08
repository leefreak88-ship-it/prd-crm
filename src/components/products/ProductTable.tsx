import { useMemo, useState } from 'react';
import {
  Button,
  Card,
  Empty,
  Form,
  Image,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tree,
  Typography,
  Upload,
  message
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { DataNode, TreeProps } from 'antd/es/tree';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useProductQuery } from '@/hooks/products/useProductQuery';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation
} from '@/hooks/products/useProductMutation';
import { useProductCategoryQuery } from '@/hooks/products/useProductCategoryQuery';
import {
  useCreateProductCategoryMutation,
  useDeleteProductCategoryMutation,
  useUpdateProductCategoryMutation
} from '@/hooks/products/useProductCategoryMutation';
import { uploadFiles } from '@/services/upload/api';
import type {
  ProductCategoryItem,
  ProductCategoryItemPayload,
  ProductItem,
  ProductPayload
} from '@/services/products/types';

interface ProductFormState {
  open: boolean;
  mode: 'create' | 'edit';
  current?: ProductItem;
}

interface CategoryFormState {
  open: boolean;
  mode: 'create' | 'edit';
  current?: ProductCategoryItem;
}

// 商品表格组件：包含分类与商品列表，支持分类与商品双 CRUD
export function ProductTable() {
  const [productForm] = Form.useForm<ProductPayload>();
  const [categoryForm] = Form.useForm<ProductCategoryItemPayload>();
  const [productModalState, setProductModalState] = useState<ProductFormState>({ open: false, mode: 'create' });
  const [categoryModalState, setCategoryModalState] = useState<CategoryFormState>({ open: false, mode: 'create' });
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [productImageList, setProductImageList] = useState<UploadFile[]>([]);
  const [imageUploading, setImageUploading] = useState(false);
  const { data: productList = [], isLoading: productLoading } = useProductQuery();
  const { data: categoryList = [] } = useProductCategoryQuery();
  const createMutation = useCreateProductMutation();
  const updateMutation = useUpdateProductMutation();
  const deleteMutation = useDeleteProductMutation();
  const createCategoryMutation = useCreateProductCategoryMutation();
  const updateCategoryMutation = useUpdateProductCategoryMutation();
  const deleteCategoryMutation = useDeleteProductCategoryMutation();
  const categoryMutationLoading =
    createCategoryMutation.isPending || updateCategoryMutation.isPending || deleteCategoryMutation.isPending;

  // 分类映射：用于快速按 id 查分类名称
  const categoryMap = useMemo(() => {
    return new Map(categoryList.map((item) => [item.id, item.goodsTypeName]));
  }, [categoryList]);
  // 分类排序：Tree 渲染与拖拽按 idx 顺序展示
  const sortedCategoryList = useMemo(() => {
    return [...categoryList].sort((a, b) => (a.idx || 0) - (b.idx || 0));
  }, [categoryList]);
  // Tree 数据：分类为扁平结构，统一用根节点子项展示
  const categoryTreeData = useMemo<DataNode[]>(() => {
    return sortedCategoryList.map((item) => ({
      key: item.id || '',
      title: item.goodsTypeName || '未命名分类'
    }));
  }, [sortedCategoryList]);

  // 当前展示商品：按选中分类过滤
  const filteredProductList = useMemo(() => {
    if (!selectedCategoryId) {
      return productList;
    }
    return productList.filter((item) => item.goodsTypeId === selectedCategoryId);
  }, [productList, selectedCategoryId]);

  // 表格列定义：展示商品核心信息与操作
  const columns: ColumnsType<ProductItem> = useMemo(
    () => [
      { title: '商品名称', dataIndex: 'goodsName', width: 180 },
      {
        title: '所属分类',
        dataIndex: 'goodsTypeId',
        width: 180,
        render: (value: string) => categoryMap.get(value) ?? '未分类'
      },
      { title: '排序', dataIndex: 'idx', width: 100 },
      {
        title: '价格(元)',
        dataIndex: 'goodsPrice',
        render: (value?: number) => `¥${value?.toLocaleString('zh-CN') || '-'}`
      },
      {
        title: '图片地址', dataIndex: 'goodsImage',
        render: (_, record) => (
          <Space>
            <Image
              width={200}
              src={record.goodsImage || ''}
            />
          </Space>
        )

      },
      {
        title: '操作',
        width: 160,
        render: (_, record) => (
          <Space>
            <Button type="link" onClick={() => openEditModal(record)}>
              编辑
            </Button>
            <Popconfirm title="确认删除该商品吗？" onConfirm={() => onDelete(record.id || '')} okText="确认" cancelText="取消">
              <Button type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </Space>
        )
      }
    ],
    [categoryMap]
  );

  // 打开商品新增弹窗：初始化默认值
  const openCreateModal = () => {
    if (categoryList.length === 0) {
      message.warning('请先创建商品分类');
      return;
    }
    setProductModalState({ open: true, mode: 'create' });
    productForm.setFieldsValue({
      goodsName: '',
      goodsImage: '',
      goodsTypeId: selectedCategoryId ?? categoryList[0].id,
      goodsPrice: 0,
      idx: 1
    });
    setProductImageList([]);
  };

  // 打开商品编辑弹窗：回填当前行数据
  const openEditModal = (record: ProductItem) => {
    setProductModalState({ open: true, mode: 'edit', current: record });
    productForm.setFieldsValue({
      goodsName: record.goodsName,
      goodsImage: record.goodsImage,
      goodsTypeId: record.goodsTypeId,
      goodsPrice: record.goodsPrice,
      idx: record.idx
    });
    if (record.goodsImage) {
      setProductImageList([
        {
          uid: record.id || 'goods-image',
          name: '商品图片',
          status: 'done',
          url: record.goodsImage
        }
      ]);
      return;
    }
    setProductImageList([]);
  };

  const onUploadProductImage: UploadProps['customRequest'] = async (options) => {
    setImageUploading(true);
    try {
      const uploadFile = options.file as File;
      const result = await uploadFiles({ files: uploadFile });
      const uploaded = result.successList[0];
      if (!uploaded?.fileUrl) {
        throw new Error('上传失败，请重试');
      }
      productForm.setFieldsValue({ goodsImage: uploaded.fileUrl });
      setProductImageList([
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

  // 提交商品表单：按模式执行新增或编辑
  const onSubmit = async () => {
    const values = await productForm.validateFields();
    if (productModalState.mode === 'create') {
      await createMutation.mutateAsync(values);
      message.success('新增商品成功');
    } else if (productModalState.current?.id) {
      await updateMutation.mutateAsync({ id: productModalState.current.id, payload: values });
      message.success('编辑商品成功');
    }
    setProductModalState({ open: false, mode: 'create' });
  };

  // 删除商品：执行删除并提示成功
  const onDelete = async (id: string) => {
    if (!id) {
      return;
    }
    await deleteMutation.mutateAsync(id);
    message.success('删除商品成功');
  };

  // 打开分类新增弹窗：初始化默认值
  const openCreateCategoryModal = () => {
    setCategoryModalState({ open: true, mode: 'create' });
    categoryForm.setFieldsValue({ goodsTypeName: '', idx: (categoryList.length || 0) + 1 });
  };

  // 打开分类编辑弹窗：回填分类数据
  const openEditCategoryModal = (categoryId?: string) => {
    const currentCategoryId = categoryId || selectedCategoryId;
    if (!currentCategoryId) {
      message.warning('请先在左侧选择分类');
      return;
    }
    const current = categoryList.find((item) => item.id === currentCategoryId);
    if (!current) {
      message.warning('当前分类不存在');
      return;
    }
    setCategoryModalState({ open: true, mode: 'edit', current });
    categoryForm.setFieldsValue({
      goodsTypeName: current.goodsTypeName,
      idx: current.idx
    });
  };

  // 删除分类：限制有商品时不可删除
  const onDeleteCategory = async (categoryId?: string) => {
    const currentCategoryId = categoryId || selectedCategoryId;
    if (!currentCategoryId) {
      message.warning('请先在左侧选择分类');
      return;
    }
    const hasProducts = productList.some((item) => item.goodsTypeId === currentCategoryId);
    if (hasProducts) {
      message.warning('当前分类下存在商品，无法删除');
      return;
    }
    await deleteCategoryMutation.mutateAsync(currentCategoryId);
    if (selectedCategoryId === currentCategoryId) {
      setSelectedCategoryId(null);
    }
    message.success('删除分类成功');
  };
  const onCategoryDrop: TreeProps['onDrop'] = async (info) => {
    const dragId = String(info.dragNode.key || '');
    const targetId = String(info.node.key || '');
    if (!dragId || !targetId || dragId === targetId) {
      return;
    }
    const currentList = [...sortedCategoryList];
    const dragIndex = currentList.findIndex((item) => item.id === dragId);
    const targetIndex = currentList.findIndex((item) => item.id === targetId);
    if (dragIndex < 0 || targetIndex < 0) {
      return;
    }
    const [dragItem] = currentList.splice(dragIndex, 1);
    const targetPos = Number(String(info.node.pos || '0-0').split('-').pop() || 0);
    const relativeDropPosition = info.dropPosition - targetPos;
    const insertBeforeTarget = relativeDropPosition < 0;
    const baseTargetIndex = currentList.findIndex((item) => item.id === targetId);
    const insertIndex = insertBeforeTarget ? baseTargetIndex : baseTargetIndex + 1;
    currentList.splice(insertIndex, 0, dragItem);
    const changedList = currentList.filter((item, index) => (item.idx || 0) !== index + 1);
    await Promise.all(
      changedList
        .filter((item) => Boolean(item.id))
        .map((item) =>
          updateCategoryMutation.mutateAsync({
            id: item.id || '',
            payload: {
              goodsTypeName: item.goodsTypeName,
              idx: currentList.findIndex((value) => value.id === item.id) + 1
            }
          })
        )
    );
    message.success('分类顺序已更新');
  };

  // 提交分类表单：按模式执行新增或编辑
  const onSubmitCategory = async () => {
    const values = await categoryForm.validateFields();
    if (categoryModalState.mode === 'create') {
      await createCategoryMutation.mutateAsync(values);
      message.success('新增分类成功');
    } else if (categoryModalState.current?.id) {
      await updateCategoryMutation.mutateAsync({ id: categoryModalState.current.id, payload: values });
      message.success('编辑分类成功');
    }
    setCategoryModalState({ open: false, mode: 'create' });
  };

  return (
    <div className="h-full">
      <div className="mb-3">
        <Typography.Title level={4} className="!mb-0">
          商品管理
        </Typography.Title>
      </div>
      <div className="grid grid-cols-12 gap-4 h-[calc(100%-40px)]">
        <Card className="col-span-3">
          <div className="mb-3 flex items-center gap-2">
            <Button size="small" onClick={openCreateCategoryModal}>
              新增分类
            </Button>

          </div>
          {categoryList.length === 0 ? (
            <Empty description="暂无分类" />
          ) : (
            <Tree
              blockNode
              draggable
              onDrop={onCategoryDrop}
              selectedKeys={selectedCategoryId ? [selectedCategoryId] : []}
              onSelect={(keys) => setSelectedCategoryId((keys[0] as string) || null)}
              treeData={categoryTreeData}
              titleRender={(node) => {
                const categoryId = String(node.key);
                const current = categoryList.find((item) => item.id === categoryId);
                return (
                  <div className="flex items-center justify-between w-full">
                    <span>{current?.goodsTypeName || '未命名分类'}</span>
                    <Space size={4}>
                      <Typography.Text type="secondary" className="text-xs">
                        拖拽排序
                      </Typography.Text>
                      <Button
                        size="small"
                        type="link"
                        onClick={(event) => {
                          event.stopPropagation();
                          openEditCategoryModal(categoryId);
                        }}
                      >
                        编辑
                      </Button>
                      <Popconfirm
                        title="确认删除当前分类吗？"
                        onConfirm={(event) => {
                          event?.stopPropagation();
                          return onDeleteCategory(categoryId);
                        }}
                        okText="确认"
                        cancelText="取消"
                      >
                        <Button
                          size="small"
                          type="link"
                          danger
                          onClick={(event) => {
                            event.stopPropagation();
                          }}
                        >
                          删除
                        </Button>
                      </Popconfirm>
                    </Space>
                  </div>
                );
              }}
            />
          )}
        </Card>
        <Card className="col-span-9">
          <div className="mb-3 flex items-center justify-between">
            <Typography.Text>
              当前分类：
              {selectedCategoryId ? categoryMap.get(selectedCategoryId) ?? '未知分类' : '全部'}
            </Typography.Text>
            <Button type="primary" onClick={openCreateModal}>
              新增商品
            </Button>
          </div>
          <Table
            rowKey="id"
            loading={productLoading}
            columns={columns}
            dataSource={filteredProductList}
            pagination={{ pageSize: 8 }}
          />
        </Card>
      </div>
      <Modal
        title={productModalState.mode === 'create' ? '新增商品' : '编辑商品'}
        open={productModalState.open}
        onOk={onSubmit}
        onCancel={() => {
          setProductModalState({ open: false, mode: 'create' });
          setProductImageList([]);
          setImageUploading(false);
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending || imageUploading}
      >
        <Form form={productForm} layout="vertical">
          <Form.Item label="商品名称" name="goodsName" rules={[{ required: true, message: '请输入商品名称' }]}>
            <Input placeholder="请输入商品名称" />
          </Form.Item>
          <Form.Item label="所属分类" name="goodsTypeId" rules={[{ required: true, message: '请选择所属分类' }]}>
            <Select options={categoryList.map((item) => ({ label: item.goodsTypeName, value: item.id }))} />
          </Form.Item>
          <Form.Item label="价格(分)" name="goodsPrice" rules={[{ required: true, message: '请输入价格' }]}>
            <InputNumber className="!w-full" min={0} precision={0} placeholder="请输入价格（分）" />
          </Form.Item>
          <Form.Item name="goodsImage" hidden>
            <Input />
          </Form.Item>
          <Form.Item label="商品图片">
            <Upload
              accept=".jpg,.jpeg,.png"
              listType="picture-card"
              maxCount={1}
              customRequest={onUploadProductImage}
              fileList={productImageList}
              onChange={({ fileList }) => setProductImageList(fileList)}
              onRemove={() => {
                productForm.setFieldsValue({ goodsImage: '' });
                return true;
              }}
            >
              {productImageList.length >= 1 ? null : '上传图片'}
            </Upload>
          </Form.Item>
          <Form.Item label="排序" name="idx">
            <InputNumber className="!w-full" min={1} precision={0} placeholder="请输入排序值" />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title={categoryModalState.mode === 'create' ? '新增分类' : '编辑分类'}
        open={categoryModalState.open}
        onOk={onSubmitCategory}
        onCancel={() => setCategoryModalState({ open: false, mode: 'create' })}
        confirmLoading={categoryMutationLoading}
      >
        <Form form={categoryForm} layout="vertical">
          <Form.Item label="分类名称" name="goodsTypeName" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          <Form.Item label="排序" name="idx">
            <InputNumber className="!w-full" min={1} precision={0} placeholder="请输入排序值" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

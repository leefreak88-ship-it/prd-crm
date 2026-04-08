/*
 * @Author: zhihao li leefreak88@gmail.com
 * @Date: 2026-04-02 21:50:07
 * @LastEditors: zhihao li leefreak88@gmail.com
 * @LastEditTime: 2026-04-02 22:22:04
 * @FilePath: \pd_crm\src\components\upload\UploadExample.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useMemo, useState } from 'react';
import { Alert, Button, Card, Progress, Radio, Space, Table, Typography, Upload, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { RcFile, UploadFile } from 'antd/es/upload/interface';
import { uploadFiles } from '@/services/upload/api';
import type { UploadFailedItem, UploadFileItem } from '@/services/upload/types';

type UploadMode = 'single' | 'batch';

function mapToNativeFile(fileList: UploadFile[]) {
  return fileList.map((item) => item.originFileObj).filter((item): item is RcFile => Boolean(item));
}

export function UploadExample() {
  const [mode, setMode] = useState<UploadMode>('single');
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successList, setSuccessList] = useState<UploadFileItem[]>([]);
  const [failList, setFailList] = useState<UploadFailedItem[]>([]);
  const [lastError, setLastError] = useState('');

  const nativeFiles = useMemo(() => mapToNativeFile(fileList), [fileList]);
  const successColumns: ColumnsType<UploadFileItem> = useMemo(
    () => [
      { title: 'fileId', dataIndex: 'fileId', width: 220 },
      {
        title: 'fileUrl',
        dataIndex: 'fileUrl',
        ellipsis: true,
        render: (value?: string) =>
          value ? (
            <Typography.Link href={value} target="_blank">
              {value}
            </Typography.Link>
          ) : (
            '-'
          )
      },
      { title: 'fileName', dataIndex: 'fileName', width: 180 },
      {
        title: 'fileSize',
        dataIndex: 'fileSize',
        width: 120,
        render: (value?: number) => (typeof value === 'number' ? `${(value / 1024).toFixed(2)} KB` : '-')
      }
    ],
    []
  );
  const failColumns: ColumnsType<UploadFailedItem> = useMemo(
    () => [
      { title: 'fileName', dataIndex: 'fileName', width: 240, render: (value?: string) => value || '-' },
      { title: 'reason', dataIndex: 'reason', render: (value?: string) => value || '-' }
    ],
    []
  );

  const maxCount = mode === 'single' ? 1 : 20;
  const accept = '.jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx';

  const onSubmit = async () => {
    if (nativeFiles.length === 0) {
      message.warning('请先选择文件');
      return;
    }
    setLoading(true);
    setProgress(0);
    setLastError('');
    try {
      const result = await uploadFiles({
        files: mode === 'single' ? nativeFiles[0]! : nativeFiles,
        onProgress: (percent) => setProgress(percent)
      });
      setSuccessList(result.successList);
      setFailList(result.failList);
      message.success('上传完成');
    } catch (error: any) {
      setLastError(error?.message || '上传失败');
      message.error(error?.message || '上传失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Space direction="vertical" className="w-full" size={12}>
        <Typography.Title level={5} className="!mb-0">
          文件上传示例
        </Typography.Title>
        <Radio.Group
          value={mode}
          onChange={(event) => {
            setMode(event.target.value);
            setFileList([]);
            setSuccessList([]);
            setFailList([]);
            setLastError('');
            setProgress(0);
          }}
        >
          <Radio.Button value="single">单文件上传</Radio.Button>
          <Radio.Button value="batch">批量上传</Radio.Button>
        </Radio.Group>
        <Upload
          multiple={mode === 'batch'}
          maxCount={maxCount}
          accept={accept}
          fileList={fileList}
          beforeUpload={() => false}
          onChange={(info) => setFileList(info.fileList)}
        >
          <Button>选择文件</Button>
        </Upload>
        <Space>
          <Button type="primary" loading={loading} onClick={onSubmit}>
            开始上传
          </Button>
          <Button disabled={loading || nativeFiles.length === 0} onClick={onSubmit}>
            失败重试
          </Button>
        </Space>
        {loading || progress > 0 ? <Progress percent={progress} /> : null}
        {lastError ? <Alert type="error" message={lastError} showIcon /> : null}
        <Typography.Text>成功数量：{successList.length}</Typography.Text>
        <Typography.Text>失败数量：{failList.length}</Typography.Text>
        <Table
          rowKey={(record) => `${record.fileId || record.fileName || 'unknown'}_${record.fileSize || 0}`}
          size="small"
          columns={successColumns}
          dataSource={successList}
          pagination={false}
        />
        {failList.length > 0 ? (
          <Table
            rowKey={(record) => `${record.fileName || 'unknown'}_${record.reason || 'unknown'}`}
            size="small"
            columns={failColumns}
            dataSource={failList}
            pagination={false}
          />
        ) : null}
      </Space>
    </Card>
  );
}

"use client";

import { Modal, Typography, List, Button, Space } from "antd";
import { observer } from "mobx-react-lite";
import { cartStore } from "@/stores";

export const CartReplaceConfirmModal = observer(function CartReplaceConfirmModal() {
  const { pendingReplace, items, confirmReplace, cancelReplace } = cartStore;
  if (!pendingReplace) return null;

  return (
    <Modal
      title="В корзине блюда из другого ресторана"
      open={!!pendingReplace}
      onCancel={cancelReplace}
      footer={
        <Space>
          <Button onClick={cancelReplace}>Отмена</Button>
          <Button type="primary" onClick={confirmReplace}>
            Заменить корзину и добавить
          </Button>
        </Space>
      }
      width={480}
    >
      <Typography.Paragraph type="secondary">
        Сейчас в корзине блюда из другого ресторана. Они будут удалены, и в корзину добавится выбранное блюдо из текущего ресторана.
      </Typography.Paragraph>
      {items.length > 0 && (
        <>
          <Typography.Text strong>Будут удалены:</Typography.Text>
          <List
            size="small"
            dataSource={items}
            renderItem={(item) => (
              <List.Item>
                {item.product.title} × {item.quantity} — {item.product.price * item.quantity} ₽
              </List.Item>
            )}
            style={{ marginTop: 8, marginBottom: 16 }}
          />
        </>
      )}
      <Typography.Text strong>Будет добавлено:</Typography.Text>
      <div style={{ marginTop: 8 }}>
        {pendingReplace.product.title} × {pendingReplace.quantity} — {pendingReplace.product.price * pendingReplace.quantity} ₽
      </div>
    </Modal>
  );
});

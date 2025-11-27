import React, { useState } from "react";
import { Form, Input, Button, Card, message, Tabs } from "antd";
import { Mail, Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { TabPane } = Tabs;

const AuthPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const API_BASE = "http://localhost:5005/api/v1";

  const handleRegister = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (res.ok) {
        message.success("Đăng ký thành công!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onLoginSuccess?.(data.user);

        if (data.user.role === "admin") navigate("/admin");
        else navigate("/");
      } else {
        message.error(data.error || "Đăng ký thất bại");
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (values) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (res.ok) {
        message.success("Đăng nhập thành công!");

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        onLoginSuccess?.(data.user);

        if (data.user.role === "admin") navigate("/admin");
        else navigate("/");
      } else {
        message.error(data.message || "Đăng nhập thất bại");
      }
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#fff",
        backgroundImage: 'url("/background.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          style={{
            width: 420,
            borderRadius: 16,
            boxShadow: "0 15px 30px rgba(0,0,0,0.2)",
          }}
        >
          <Tabs defaultActiveKey="login" centered size="large">
            <TabPane tab="Đăng nhập" key="login">
              <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Vui lòng nhập email" }]}
                >
                  <Input prefix={<Mail size={16} />} placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                  ]}
                >
                  <Input.Password
                    prefix={<Lock size={16} />}
                    placeholder="Nhập mật khẩu"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    Đăng nhập
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="Đăng ký" key="register">
              <Form layout="vertical" onFinish={handleRegister}>
                <Form.Item
                  label="Tên"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tên",
                    },
                  ]}
                >
                  <Input prefix={<User size={16} />} placeholder="Nhập tên" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[{ required: true, message: "Vui lòng nhập email" }]}
                >
                  <Input prefix={<Mail size={16} />} placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                  label="Mật khẩu"
                  name="password"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu" },
                  ]}
                >
                  <Input.Password
                    prefix={<Lock size={16} />}
                    placeholder="Nhập mật khẩu"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                  >
                    Đăng ký
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;

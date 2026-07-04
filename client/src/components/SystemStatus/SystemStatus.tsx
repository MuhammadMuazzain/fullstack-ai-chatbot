import React, { useEffect, useState } from "react";
import { axios } from "../middleware/axios";
import { Paragraph, Small } from "../shared/layout";
import "./style.css";

type HealthResponse = {
  status: string;
  service: string;
  version: string;
  timestamp: string;
  dependencies: {
    redis: string;
  };
  integrations: {
    llm_api: string;
    message_queue: string;
    worker_channel: string;
  };
  stack: {
    api: string;
    worker: string;
    frontend: string;
  };
};

function statusClass(value: string): string {
  if (value === "ok" || value === "connected" || value === "configured") {
    return "status-ok";
  }
  if (value === "degraded" || value === "unavailable") {
    return "status-warn";
  }
  return "status-muted";
}

const SystemStatus = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await axios.get<HealthResponse>("/health");
        setHealth(response.data);
      } catch {
        setError("API offline — start the FastAPI server on port 3500");
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="system-status">
      <div className="system-status-header">
        <Small>Operations Dashboard</Small>
        <span className="system-status-label">Live service monitor</span>
      </div>
      {error ? (
        <Paragraph className="status-warn">{error}</Paragraph>
      ) : health ? (
        <>
          <div className="system-status-grid">
            <div className="status-card">
              <Small>API</Small>
              <Paragraph className={statusClass(health.status)}>{health.status}</Paragraph>
            </div>
            <div className="status-card">
              <Small>Redis</Small>
              <Paragraph className={statusClass(health.dependencies.redis)}>
                {health.dependencies.redis}
              </Paragraph>
            </div>
            <div className="status-card">
              <Small>LLM integration</Small>
              <Paragraph className={statusClass(health.integrations.llm_api)}>
                {health.integrations.llm_api}
              </Paragraph>
            </div>
            <div className="status-card">
              <Small>Version</Small>
              <Paragraph>{health.version}</Paragraph>
            </div>
          </div>
          <div className="system-status-meta">
            <Small>
              Stack: {health.stack.frontend} + {health.stack.api} + {health.stack.worker} · Queue:{" "}
              {health.integrations.message_queue}
            </Small>
          </div>
        </>
      ) : (
        <Paragraph>Checking services…</Paragraph>
      )}
    </div>
  );
};

export default SystemStatus;

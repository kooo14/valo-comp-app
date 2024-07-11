import React from "react";
import Image from "react-bootstrap/image";
import Card from "react-bootstrap/Card";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

interface PlayerCardProps {
  playerName: string;
  proficiency: number;
  agent: string;
  priority: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({
  playerName,
  proficiency,
  agent,
  priority,
}) => {
  var agentImage = agent;
  if (agent === "KAY/O") agentImage = "KAY-O";

  const proficiencys = ["◯", "△", "✕"]

  return (
    <>
      <Card className="mb-2">
        <Card.Body className="">
          <Row>
            <Col sm={2}>
              <Image
                src={`${process.env.PUBLIC_URL}/agents/${agentImage}.png`}
              ></Image>
            </Col>
            <Col sm={8}>
              <Row>
                <h2><strong>{playerName}</strong></h2>
              </Row>
              <Row>
                <h4 className="mt-1">{agent}</h4>
              </Row>
            </Col>
            <Col sm={2} id="additional-data">
              <Row className="mb-2 mt-2">
                得意度：{proficiencys[proficiency - 1]}
              </Row>
              <Row className="mb-2 mt-2">
                優先度：{priority}
              </Row>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default PlayerCard;

import {
	Body,
	Button,
	Container,
	Head,
	Hr,
	Html,
	Link,
	Preview,
	Section,
	Text,
} from "@react-email/components";
import {
	button,
	container,
	EmailFonts,
	EmailFooter,
	EmailHeader,
	link,
	main,
	section,
	signatureText,
	text,
	topBorder,
	topBorderSection,
} from "../../components";

interface WebinarInvitationEmailProps {
	userName?: string;
	webinarDate?: string;
	webinarTime?: string;
	joinUrl?: string;
}

export const WebinarInvitationEmail = ({
	userName = "there",
	webinarDate = "January 15, 2025",
	webinarTime = "2:00 PM EST",
	joinUrl = "https://nexxonn.ai/webinar",
}: WebinarInvitationEmailProps) => {
	return (
		<Html>
			<Head>
				<EmailFonts />
			</Head>
			<Preview>Join us for Building AI Agents with Nexxonn</Preview>
			<Body style={main}>
				<Container style={container}>
					<EmailHeader
						heading="Let's grow together."
						subheading="Become a Nexxonn Ambassador."
					/>
					<Section style={topBorderSection}>
						<Hr style={topBorder} />
					</Section>
					<Section style={section}>
						<Text style={text}>Hi {userName},</Text>
						<Text style={text}>
							We&apos;re hosting a live webinar: &quot;Building AI Agents with
							Nexxonn.&quot;
						</Text>
						<Text style={text}>
							🗓️ Date: {webinarDate}
							<br />⏰ Time: {webinarTime}
						</Text>
						<Text style={text}>
							Learn how to design, deploy, and scale AI agents — and get your
							questions answered directly by our team.
						</Text>
						<Button href={joinUrl} style={button}>
							Join Event
						</Button>
						<Text style={signatureText}>
							—<br />
							The Nexxonn Team
							<br />
							<Link href="https://nexxonn.ai" style={link}>
								https://nexxonn.ai
							</Link>
						</Text>
					</Section>
					<Section style={topBorderSection}>
						<Hr style={topBorder} />
					</Section>
				</Container>
				<EmailFooter />
			</Body>
		</Html>
	);
};

WebinarInvitationEmail.PreviewProps = {
	userName: "John",
	webinarDate: "January 15, 2025",
	webinarTime: "2:00 PM EST",
	joinUrl: "https://nexxonn.ai/webinar",
} as WebinarInvitationEmailProps;

export default WebinarInvitationEmail;

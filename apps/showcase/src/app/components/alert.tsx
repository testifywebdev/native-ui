import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function AlertDemo() {
  return (
    <>
    <Alert variant="info">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the CLI.
      </AlertDescription>
    </Alert>
    <Alert variant="warning">
      <AlertTitle>Warning!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the CLI.
      </AlertDescription>
    </Alert>
    <Alert variant="destructive">
      <AlertTitle>Error!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the CLI.
      </AlertDescription>
    </Alert>
    <Alert variant="success">
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the CLI.
      </AlertDescription>
    </Alert>
     <Alert variant="default">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can add components and dependencies to your app using the CLI.
      </AlertDescription>
    </Alert>
  </>
  );
}

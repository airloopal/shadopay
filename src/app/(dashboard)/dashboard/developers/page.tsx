import { requireActiveMerchant } from "@/lib/session";
import { listApiKeys, listWebhooks, listRequestLogs } from "@/features/developers/queries";
import { createWebhookAction, revokeApiKeyAction } from "@/features/developers/actions";
import { CreateApiKeyDialog } from "@/features/developers/create-api-key-dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { truncateMiddle, formatDateTime } from "@/lib/utils";

export default async function DevelopersPage() {
  const { merchant } = await requireActiveMerchant();
  const [apiKeys, webhooks, requestLogs] = await Promise.all([
    listApiKeys(merchant.id),
    listWebhooks(merchant.id),
    listRequestLogs(merchant.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Developers</h1>
        <p className="text-sm text-muted-foreground">API keys, webhooks, and request activity.</p>
      </div>

      <Tabs defaultValue="keys">
        <TabsList>
          <TabsTrigger value="keys">API keys</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="logs">Request logs</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="keys">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>API keys</CardTitle>
              <CreateApiKeyDialog />
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Key</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Last used</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {apiKeys.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                        No API keys yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {apiKeys.map((key) => (
                    <TableRow key={key.id}>
                      <TableCell className="font-medium">{key.name}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {truncateMiddle(key.keyPrefix, 12, 0)}…
                      </TableCell>
                      <TableCell>
                        <Badge variant={key.mode === "LIVE" ? "accent" : "default"}>{key.mode}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {key.lastUsedAt ? formatDateTime(key.lastUsedAt) : "Never"}
                      </TableCell>
                      <TableCell className="text-right">
                        {key.revokedAt ? (
                          <Badge variant="danger">Revoked</Badge>
                        ) : (
                          <form action={revokeApiKeyAction.bind(null, key.id)}>
                            <Button variant="outline" size="sm" type="submit">
                              Revoke
                            </Button>
                          </form>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Add endpoint</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <form action={createWebhookAction} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="url">Endpoint URL</Label>
                    <Input id="url" name="url" placeholder="https://yourapp.com/webhooks/payflow" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="events">Events (comma separated)</Label>
                    <Input id="events" name="events" placeholder="payment.succeeded, payment.failed" />
                  </div>
                  <Button type="submit" className="w-full">Add endpoint</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>URL</TableHead>
                      <TableHead>Events</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {webhooks.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="py-8 text-center text-muted-foreground">
                          No webhook endpoints configured.
                        </TableCell>
                      </TableRow>
                    )}
                    {webhooks.map((wh) => (
                      <TableRow key={wh.id}>
                        <TableCell className="font-mono text-xs">{wh.url}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{wh.events.join(", ")}</TableCell>
                        <TableCell>
                          <Badge variant={wh.isActive ? "success" : "default"}>
                            {wh.isActive ? "Active" : "Disabled"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Recent API requests</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Key</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Path</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requestLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-8 text-center text-muted-foreground">
                        No API requests recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                  {requestLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="text-xs text-muted-foreground">{log.apiKey.name}</TableCell>
                      <TableCell className="font-mono text-xs">{log.method}</TableCell>
                      <TableCell className="font-mono text-xs">{log.path}</TableCell>
                      <TableCell>
                        <Badge variant={log.statusCode < 400 ? "success" : "danger"}>{log.statusCode}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{log.latencyMs}ms</TableCell>
                      <TableCell className="text-muted-foreground">{formatDateTime(log.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="docs">
          <Card>
            <CardHeader>
              <CardTitle>API documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm text-muted-foreground">
              <p>Authenticate requests with your API key in the Authorization header:</p>
              <pre className="overflow-x-auto rounded-md border border-border bg-surface-raised p-3 font-mono text-xs text-foreground">
{`curl https://api.payflow.dev/v1/charges \\
  -H "Authorization: Bearer pk_live_..." \\
  -d amount=2000 -d currency=usd`}
              </pre>
              <p>Sandbox mode uses <code className="text-foreground">pk_test_</code> keys and never moves real money.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

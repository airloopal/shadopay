import { LifeBuoy, Mail, BookOpen } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-light tracking-tight text-foreground">Support</h1>
        <p className="text-sm text-muted-foreground">We typically respond within one business day.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center gap-3 space-y-0">
            <LifeBuoy className="h-5 w-5 text-accent" />
            <CardTitle>Contact support</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <form className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" placeholder="What do you need help with?" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="message">Message</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full rounded-sm border border-border bg-surface-raised p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  placeholder="Include any relevant transaction or settlement IDs."
                />
              </div>
              <Button type="submit">Send message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Direct contact</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">
              support@payflow.dev
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Help center</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">
              Browse guides on settlements, disputes, and integration in the Developers tab.
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

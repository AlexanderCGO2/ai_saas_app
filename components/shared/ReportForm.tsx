"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const reportSchema = z.object({
  topic: z.string().nonempty({ message: "Topic is required" }),
  reportType: z.enum(["Fast", "Slow but profound"]),
  language: z.string().nonempty({ message: "Language is required" }),
});

const ReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState<string[]>([]);
  const [reportGenerated, setReportGenerated] = useState(false);

  const form = useForm({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      topic: "",
      reportType: "Fast",
      language: navigator.language || "en",
    },
  });

  useEffect(() => {
    // Initialize WebSocket connection for real-time updates
    const ws = new WebSocket("wss://example.com/realtime-updates");

    ws.onmessage = (event) => {
      setRealTimeUpdates((prevUpdates) => [...prevUpdates, event.data]);
    };

    return () => {
      ws.close();
    };
  }, []);

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    // Replace with actual report generation logic
    setTimeout(() => {
      setIsSubmitting(false);
      setReportGenerated(true);
    }, 2000);
  };

  const downloadReport = (format: string) => {
    // Replace with actual logic to download the report in the selected format
    console.log(`Downloading report in ${format} format`);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Topic</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter report topic" />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reportType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Report Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fast">Fast</SelectItem>
                  <SelectItem value="Slow but profound">
                    Slow but profound
                  </SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  {/* Add more languages as needed */}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Generating..." : "Generate Report"}
        </Button>
      </form>

      <div className="mt-8">
        <h2>Real-Time Updates</h2>
        <div className="bg-gray-100 p-4 rounded">
          {realTimeUpdates.map((update, index) => (
            <div key={index}>{update}</div>
          ))}
        </div>
      </div>

      {reportGenerated && (
        <div className="mt-8">
          <h2>Download Report</h2>
          <Button onClick={() => downloadReport("pdf")}>Download PDF</Button>
          <Button onClick={() => downloadReport("doc")} className="ml-4">
            Download DOC
          </Button>
          <Button onClick={() => downloadReport("md")} className="ml-4">
            Download Markdown
          </Button>
        </div>
      )}
    </Form>
  );
};

export default ReportForm;
package TFG.shared_list.dto;

public class ItemRequest {
    private String text;
    private Boolean completed;

    public ItemRequest() {
    }

    public ItemRequest(String text, Boolean completed) {
        this.text = text;
        this.completed = completed;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }
}

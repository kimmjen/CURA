package com.cura.exception;

import com.cura.dto.CommonDto;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<CommonDto.ErrorResponse> handleResourceNotFound(ResourceNotFoundException ex) {
        CommonDto.ErrorResponse error = CommonDto.ErrorResponse.builder()
                .message(ex.getMessage() != null ? ex.getMessage() : "Resource not found")
                .status(HttpStatus.NOT_FOUND.value())
                .build();
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<CommonDto.ErrorResponse> handleDuplicateResource(DuplicateResourceException ex) {
        CommonDto.ErrorResponse error = CommonDto.ErrorResponse.builder()
                .message(ex.getMessage() != null ? ex.getMessage() : "Duplicate resource")
                .status(HttpStatus.CONFLICT.value())
                .build();
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error);
    }

    @ExceptionHandler(ExternalApiException.class)
    public ResponseEntity<CommonDto.ErrorResponse> handleExternalApiError(ExternalApiException ex) {
        CommonDto.ErrorResponse error = CommonDto.ErrorResponse.builder()
                .message(ex.getMessage() != null ? ex.getMessage() : "External API error")
                .status(HttpStatus.BAD_GATEWAY.value())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(error);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<CommonDto.ErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        CommonDto.ErrorResponse error = CommonDto.ErrorResponse.builder()
                .message(ex.getMessage() != null ? ex.getMessage() : "Invalid argument")
                .status(HttpStatus.BAD_REQUEST.value())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonDto.ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));

        CommonDto.ErrorResponse error = CommonDto.ErrorResponse.builder()
                .message(errors)
                .status(HttpStatus.BAD_REQUEST.value())
                .build();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonDto.ErrorResponse> handleGenericError(Exception ex) {
        CommonDto.ErrorResponse error = CommonDto.ErrorResponse.builder()
                .message(ex.getMessage() != null ? ex.getMessage() : "Internal server error")
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .build();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}
